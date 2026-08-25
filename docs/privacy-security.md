# Privacy and security requirements

## Data minimization

The baseline client has no account, advertising SDK, behavioral profile, or cross-device sync. Publisher requests are public-resource fetches and do not need cookies or credentials.

The client MUST NOT send user choices, progress, reminder settings, order/preparation state, transfer payloads, or a stable device identifier to a publisher unless a future, separately consented contract explicitly introduces that data flow.

## Local storage

Private state is encrypted at rest where platform capabilities permit, excluded from unreviewed cloud backup, namespaced per publisher/experience, and covered by export and delete controls. Lock-screen notification text is generic by default.

## Network and origin controls

- HTTPS only for discovery/resources in production.
- Reject embedded credentials and malformed/ambiguous URLs.
- Block loopback, link-local, private-network, and unsafe redirect targets by default.
- Revalidate every redirect and final canonical origin.
- Do not attach publisher cookies or credentials to public resources.
- Restrict external links and assets to manifest-declared HTTPS origins.
- Do not expose a native JavaScript bridge to untrusted web content.

## Resource limits

Clients enforce maximum encoded/decoded connection size, document depth, string/collection size, asset bytes/dimensions/MIME, redirect count, recurrence horizon, pending notifications, and cache usage. Parsing and validation occur before activation.

The app-owned HTTPS handoff carries its fields in the URL fragment. The handoff service MUST NOT require an account or attempt to collect the fragment. Its browser fallback SHOULD avoid third-party scripts and analytics. The client MUST validate every field received from a Universal Link or App Link as untrusted input before using the discovery URL.

## Remote-content boundary

Publisher resources cannot include JavaScript, WebAssembly, native code, plugins, raw CSS, arbitrary HTML templates, event handlers, tracking pixels, permission requests, or an executable expression/formula language. New code or native capability requires a signed app-store release.

The bounded condition schema can compare only declared local choice values using the fixed operators in the contract. Clients reject unknown operators, unknown choice IDs, excessive nesting, type mismatches, and conditions outside the signed resource set.

## Logging

Logs and crash reports exclude URL fragments, connection payloads, local state, item/action labels derived from private selections, filesystem exports, and notification content. Diagnostics use public versions and privacy-safe error categories.

## Threat model minimums

Conformance fixtures must cover malicious handoff payloads, invalid handoff origins/paths, unsafe network targets, redirect origin changes, duplicate fields and JSON keys, oversized/deep documents, invalid/expired/rollback signatures, digest mismatches, unknown components, hostile asset types, external-link escapes, partial updates, and state leakage in requests/logs.
