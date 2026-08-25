# Website Companion Specification

An open, domain-neutral contract for mobile apps that render user-selected website experiences with local progress, offline access, user-configured reminders, and publisher-supplied branding.

Status: **0.1.0 draft — not production ready**

## Reference client purpose

The app extends compatible, content-rich website experiences to mobile devices. After a user connects a website, it integrates the website's supported content, lists, and tasks with device-local progress, offline access, and user-configured notifications.

## Core boundary

A conforming mobile client starts disconnected. It does not contain a default publisher, private registry, domain-specific vocabulary, hidden endpoint, or remotely downloaded application runtime. A user explicitly enters a compatible HTTPS URL or activates a connection URL before the client makes a publisher request. QR codes contain that ordinary HTTPS handoff URL so the operating system's camera can open the app without an in-app camera permission or scanner.

Publishers provide signed, declarative JSON resources. The installed app provides and executes every component, interaction primitive, local-storage rule, accessibility requirement, native permission flow, and notification scheduler.

Local filtering uses only the contract's bounded condition vocabulary: comparisons against explicitly declared local choice IDs combined with `all`, `any`, and `not`. Publishers cannot provide scripts, expressions, functions, dynamic property access, network actions, or other executable rule mechanisms.

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

See [Architecture](docs/architecture.md), [discovery resolution](docs/discovery-resolution.md), [client conformance](docs/client-conformance.md), [QR onboarding](docs/qr-onboarding.md), [refresh and activation](docs/refresh.md), [schedules and local reminders](docs/schedules-reminders.md), [signing and trust](docs/signing.md), and [privacy and security](docs/privacy-security.md).

## Repository layout

```text
docs/                    Normative design and security requirements
spec/openapi.yaml        HTTP surface
spec/schemas/            JSON Schemas for discovery, manifests, presentation, content, choices, actions, schedules, and catalogues
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
