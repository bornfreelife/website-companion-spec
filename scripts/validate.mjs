import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parse as parseYaml } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const loadJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const cases = [
  ['spec/schemas/discovery.schema.json', 'spec/examples/neutral/discovery.json'],
  ['spec/schemas/manifest.schema.json', 'spec/examples/neutral/manifest.json'],
  ['spec/schemas/presentation.schema.json', 'spec/examples/neutral/presentation.json']
];

for (const [schemaPath, examplePath] of cases) {
  const schema = await loadJson(schemaPath);
  const example = await loadJson(examplePath);
  const validate = ajv.compile(schema);
  if (!validate(example)) {
    throw new Error(`${examplePath} failed ${schemaPath}:\n${JSON.stringify(validate.errors, null, 2)}`);
  }
}

const openapi = parseYaml(await readFile(path.join(root, 'spec/openapi.yaml'), 'utf8'));
if (openapi.openapi !== '3.1.0' || !openapi.paths?.['/.well-known/website-companion.json']) {
  throw new Error('OpenAPI document is missing the draft version or discovery route');
}

const connection = (await readFile(path.join(root, 'spec/examples/neutral/connection.txt'), 'utf8')).trim();
const connectionUrl = new URL(connection);
if (connectionUrl.protocol !== 'wcx:' || connectionUrl.hostname !== 'connect') {
  throw new Error('Neutral connection QR is not a wcx://connect payload');
}
if (connectionUrl.hash) {
  throw new Error('Connection-only QR must not contain a transfer fragment');
}
const discovery = connectionUrl.searchParams.get('discovery');
if (!discovery || new URL(discovery).protocol !== 'https:') {
  throw new Error('Connection QR must contain an HTTPS discovery URL');
}

const manifest = await loadJson('spec/examples/neutral/manifest.json');
const discoveryDocument = await loadJson('spec/examples/neutral/discovery.json');
if (new URL(discoveryDocument.publisher.origin).hostname !== 'demo.example') {
  throw new Error('Neutral reference fixture must use the reserved demonstration origin');
}
if (manifest.experiences.some((experience) => experience.experienceId !== 'community-events')) {
  throw new Error('Neutral reference fixture contains an unexpected experience');
}
const presentationBytes = await readFile(path.join(root, 'spec/examples/neutral/presentation.json'));
const presentationDigest = createHash('sha256').update(presentationBytes).digest('hex');
const presentationRef = manifest.resources.find((resource) => resource.resourceId === 'community-events.presentation');
if (!presentationRef || presentationRef.sha256 !== presentationDigest) {
  throw new Error(`Presentation digest mismatch; expected ${presentationDigest}`);
}

const markdownFiles = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'GOVERNANCE.md', 'SECURITY.md'];
for (const entry of await readdir(path.join(root, 'docs'), { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.md')) {
    markdownFiles.push(path.join('docs', entry.name));
  }
}
for (const entry of await readdir(path.join(root, 'spec/examples/neutral'), { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.md')) {
    markdownFiles.push(path.join('spec/examples/neutral', entry.name));
  }
}

for (const markdownPath of markdownFiles) {
  const markdown = await readFile(path.join(root, markdownPath), 'utf8');
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:https?:|mailto:|#)/i.test(rawTarget)) continue;
    const fileTarget = decodeURIComponent(rawTarget.split('#', 1)[0]);
    await access(path.resolve(path.dirname(path.join(root, markdownPath)), fileTarget));
  }
}

console.log('Validated schemas, neutral examples, QR boundary, OpenAPI structure, resource digest, and local links.');
