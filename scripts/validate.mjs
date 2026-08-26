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

const schemaPaths = [
  'spec/schemas/condition.schema.json',
  'spec/schemas/discovery.schema.json',
  'spec/schemas/manifest.schema.json',
  'spec/schemas/presentation.schema.json',
  'spec/schemas/content.schema.json',
  'spec/schemas/choices.schema.json',
  'spec/schemas/actions.schema.json',
  'spec/schemas/schedule.schema.json',
  'spec/schemas/catalogue.schema.json'
];

for (const schemaPath of schemaPaths) {
  ajv.addSchema(await loadJson(schemaPath));
}

const cases = [
  ['spec/schemas/discovery.schema.json', 'spec/examples/neutral/discovery.json'],
  ['spec/schemas/manifest.schema.json', 'spec/examples/neutral/manifest.json'],
  ['spec/schemas/presentation.schema.json', 'spec/examples/neutral/presentation.json'],
  ['spec/schemas/content.schema.json', 'spec/examples/neutral/content.json'],
  ['spec/schemas/choices.schema.json', 'spec/examples/neutral/choices.json'],
  ['spec/schemas/actions.schema.json', 'spec/examples/neutral/actions.json'],
  ['spec/schemas/schedule.schema.json', 'spec/examples/neutral/schedule.json'],
  ['spec/schemas/catalogue.schema.json', 'spec/examples/neutral/catalogue.json']
];

for (const [schemaPath, examplePath] of cases) {
  const schema = await loadJson(schemaPath);
  const example = await loadJson(examplePath);
  const validate = ajv.getSchema(schema.$id);
  if (!validate) {
    throw new Error(`Schema was not registered: ${schemaPath}`);
  }
  if (!validate(example)) {
    throw new Error(`${examplePath} failed ${schemaPath}:\n${JSON.stringify(validate.errors, null, 2)}`);
  }
}

const conditionSchema = await loadJson('spec/schemas/condition.schema.json');
const validateCondition = ajv.getSchema(conditionSchema.$id + '#/$defs/condition');
if (!validateCondition
  || validateCondition({ choiceId: 'example-choice', operator: 'equals' })
  || validateCondition({ choiceId: 'example-choice', operator: 'truthy', value: true })) {
  throw new Error('Condition schema did not enforce operator/value semantics');
}

const openapi = parseYaml(await readFile(path.join(root, 'spec/openapi.yaml'), 'utf8'));
if (openapi.openapi !== '3.1.0' || !openapi.paths?.['/.well-known/website-companion.json']) {
  throw new Error('OpenAPI document is missing the draft version or discovery route');
}

const connection = (await readFile(path.join(root, 'spec/examples/neutral/connection.txt'), 'utf8')).trim();
const connectionUrl = new URL(connection);
if (connectionUrl.protocol !== 'https:' || connectionUrl.hostname !== 'companion-client.example' || connectionUrl.pathname !== '/connect/') {
  throw new Error('Neutral connection QR is not an HTTPS client handoff URL');
}
if (connectionUrl.search) {
  throw new Error('Connection fields must not be sent to the handoff server as a query');
}
const connectionFields = new URLSearchParams(connectionUrl.hash.slice(1));
if (connectionFields.get('version') !== '1' || connectionFields.has('transfer')) {
  throw new Error('Connection-only QR has an invalid version or contains progress');
}
const discovery = connectionFields.get('discovery');
if (!discovery || new URL(discovery).protocol !== 'https:') {
  throw new Error('Connection QR must contain an HTTPS discovery URL');
}
if (connectionFields.get('experience') !== 'community-events') {
  throw new Error('Connection QR must contain the expected optional experience ID');
}

const manifest = await loadJson('spec/examples/neutral/manifest.json');
const discoveryDocument = await loadJson('spec/examples/neutral/discovery.json');
const neutralSchedule = await loadJson('spec/examples/neutral/schedule.json');
if (new URL(discoveryDocument.publisher.origin).hostname !== 'demo.example') {
  throw new Error('Neutral reference fixture must use the reserved demonstration origin');
}
if (manifest.experiences.some((experience) => experience.experienceId !== 'community-events')) {
  throw new Error('Neutral reference fixture contains an unexpected experience');
}
const routinePointIds = new Set(neutralSchedule.routinePoints?.map((point) => point.routinePointId) ?? []);
if (routinePointIds.size !== (neutralSchedule.routinePoints?.length ?? 0)) {
  throw new Error('Neutral schedule contains duplicate routine-point IDs');
}
const timeAnchorIds = new Set(neutralSchedule.timeAnchors.map((anchor) => anchor.anchorId));
if (timeAnchorIds.size !== neutralSchedule.timeAnchors.length) {
  throw new Error('Neutral schedule contains duplicate time-anchor IDs');
}
if (neutralSchedule.timeAnchors.some((anchor) => anchor.relativeTo && !routinePointIds.has(anchor.relativeTo.routinePointId))) {
  throw new Error('Neutral schedule contains an unknown routine-point relationship');
}
if (neutralSchedule.completionPolicy && !routinePointIds.has(neutralSchedule.completionPolicy.resetAtRoutinePointId)) {
  throw new Error('Neutral schedule completion policy refers to an unknown routine point');
}
const neutralResourceFiles = {
  'community-events.presentation': 'presentation.json',
  'community-events.content': 'content.json',
  'community-events.choices': 'choices.json',
  'community-events.actions': 'actions.json',
  'community-events.schedule': 'schedule.json',
  'community-events.catalogue': 'catalogue.json'
};

for (const [resourceId, filename] of Object.entries(neutralResourceFiles)) {
  const bytes = await readFile(path.join(root, 'spec/examples/neutral', filename));
  const digest = createHash('sha256').update(bytes).digest('hex');
  const reference = manifest.resources.find((resource) => resource.resourceId === resourceId);
  if (!reference || reference.sha256 !== digest || reference.bytes !== bytes.byteLength) {
    throw new Error(`${resourceId} digest/size mismatch; expected ${digest} and ${bytes.byteLength} bytes`);
  }
  if (new URL(reference.url).searchParams.get('version') !== reference.version) {
    throw new Error(`${resourceId} URL does not pin its declared immutable version`);
  }
}

for (const experience of manifest.experiences) {
  for (const resourceId of experience.resourceIds) {
    if (!manifest.resources.some((resource) => resource.resourceId === resourceId)) {
      throw new Error(`${experience.experienceId} references missing resource ${resourceId}`);
    }
  }
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

console.log('Validated schemas, neutral examples, QR boundary, OpenAPI structure, resource digests, and local links.');
