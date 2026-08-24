# Website Companion Specification

An open, domain-neutral contract for mobile apps that render user-selected website experiences with local progress, offline access, user-configured reminders, and publisher-supplied branding.

Status: **0.1.0 draft — not production ready**

## Core boundary

A conforming mobile client starts disconnected. It does not contain a default publisher, private registry, domain-specific vocabulary, hidden endpoint, or remotely downloaded application runtime. A user explicitly enters a compatible HTTPS URL or scans a connection QR before the client makes a publisher request.

Publishers provide signed, declarative JSON resources. The installed app provides and executes every component, interaction primitive, local-storage rule, accessibility requirement, native permission flow, and notification scheduler.

Publisher resources may provide:

- identity, terms, privacy, support, and provenance;
- content, choices, checklists, catalogues, schedules, and external links;
- semantic theme tokens, static assets, and bounded screen composition;
- cache metadata and compatible content updates.

Publisher resources must not provide executable native code, JavaScript, WebAssembly, raw CSS, arbitrary HTML templates, plugins, native permission requests, or unrestricted formulas.

## Privacy properties

- Connection refreshes contain no user answers, progress, order state, notification state, or stable device identifier.
- Local state is namespaced by publisher and experience.
- Connection-only QR codes contain no progress.
- Optional transfer fragments are quarantined locally before any network request and are never sent to the publisher.
- A failed, unsigned, incompatible, or partial update cannot replace the last-known-good resource set.

See [Architecture](docs/architecture.md), [client conformance](docs/client-conformance.md), [QR onboarding](docs/qr-onboarding.md), [refresh and activation](docs/refresh.md), [signing and trust](docs/signing.md), and [privacy and security](docs/privacy-security.md).

## Repository layout

```text
docs/                    Normative design and security requirements
spec/openapi.yaml        HTTP surface
spec/schemas/            JSON Schemas
spec/examples/neutral/   Domain-neutral reference publisher
scripts/                 Draft conformance checks
```

The neutral example is a community-events companion that demonstrates the complete draft capability set without defining a preferred publisher domain.

## Validate the draft

```bash
npm ci
npm test
```

## Versioning

The project uses semantic versioning. Until `1.0.0`, schemas and security requirements may change incompatibly. Publishers and clients must pin a supported contract version and fail closed on unsupported major versions.

## Scope and responsibility

This specification does not certify the safety, legality, regulatory status, or store-policy compliance of a connected publisher or its content. Client and publisher implementers remain responsible for their actual functionality, claims, data practices, displayed content, external links, and jurisdictions.

## License

[MIT](LICENSE)
