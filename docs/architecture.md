# Architecture

## Actors

- **User:** selects and confirms a publisher, makes choices, owns local progress, and configures reminders.
- **Publisher:** serves public declarative resources and owns its content, claims, external links, support, provenance, and update process.
- **Client:** validates and renders supported resources, stores local state, schedules local reminders, and enforces native/security/accessibility limits.

## Connection flow

```text
fresh disconnected client
  -> user types HTTPS URL or activates an HTTPS connection link/QR
  -> local parse and fragment quarantine
  -> explicit handoff-fragment discovery URL or bounded page/link discovery resolution
  -> HTTPS discovery document
  -> publisher identity/key/capability preview
  -> user confirms connection
  -> signed manifest and hashed resources
  -> isolated validation
  -> atomic activation
  -> encrypted namespaced local state
```

No publisher request occurs before the user initiates a connection. The client does not send the handoff fragment, local answers, progress, reminder configuration, or a cross-publisher identifier during discovery or refresh. The app uses its associated HTTPS handoff domain rather than requesting camera permission or embedding a QR decoder.

## Fixed runtime, declarative resources

The signed client owns:

- component implementations and navigation invariants;
- local state, migrations, export, and deletion;
- native permissions, browser handoff, files, sharing, and notifications;
- accessibility, safe areas, contrast, text scaling, reduced motion, and offline behavior;
- schema, origin, link, resource-size, cache, signature, and compatibility enforcement.

A publisher may select from supported components and provide content, theme tokens, static assets, schedules, and external links. A publisher cannot add executable behavior or a new native capability without a client/store release.

Choice-dependent visibility is declarative rather than executable. Version 1 permits only the documented scalar predicates and bounded `all`, `any`, and `not` groups. The client evaluates them against namespaced local choices. There is no remote expression language, dynamic property access, formula evaluator, or publisher callback.

## State separation

Public resources and private local state are separate data planes:

```text
publisher -> public signed resources -> client cache
user      -> private local choices   -> encrypted local store
client    -> generic cache validators -> publisher
```

Private state is keyed by canonical publisher origin, stable site ID, and experience ID. One connected publisher cannot enumerate or overwrite another publisher's state.

## Content responsibility

The client MUST identify the publisher and preserve source/provenance metadata. Conformance does not approve publisher content. Clients remain responsible for content they display or link to under applicable platform rules, and publishers remain responsible for their functionality, claims, and legal obligations.
