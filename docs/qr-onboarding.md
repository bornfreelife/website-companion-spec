# QR onboarding

Status: draft.

## Canonical connection payload

The provisional in-app scanner format is:

```text
wcx://connect?version=1&discovery=https%3A%2F%2Fdemo.example%2F.well-known%2Fwebsite-companion.json&experience=community-events
```

`wcx` is a provisional identifier for in-app parsing, not a registered operating-system URL scheme. An implementation may separately provide an app-owned universal link, but it MUST resolve to the same fields and security flow.

Required fields:

- `version=1`
- one absolute HTTPS `discovery` URL

Optional fields:

- `experience`: stable experience ID to highlight after discovery
- `#transfer=...`: opaque local-only transfer payload

Unknown required fields, duplicate security-sensitive fields, embedded URL credentials, non-HTTPS discovery, invalid encodings, and oversized payloads MUST be rejected.

## Two modes

### Connection only

This is the default. It contains no user answers or progress.

### Connection with progress

This is an explicit export. Anyone who can see or photograph the QR may possess the transfer payload. The website MUST show that warning before rendering it, and the client MUST offer `Connect without progress` plus an import preview.

Progress-transfer encryption is not standardized in 0.1. Implementations MUST NOT describe the draft transfer fragment as encrypted unless they use a separately documented and reviewed encryption profile. Prefer a connection-only QR until that profile exists.

## Local parse order

The client MUST:

1. decode the QR in memory without navigating to it;
2. remove and quarantine the fragment before any network operation or log event;
3. validate scheme, length, URL, and target-network policy;
4. fetch only the fragment-free discovery URL;
5. show publisher identity, canonical origin, capabilities, terms/privacy/support, and refresh behavior;
6. connect only after user confirmation;
7. validate and atomically activate resources;
8. preview and import an optional transfer locally;
9. never transmit the transfer to the publisher.

## Legacy HTTPS URLs

Clients MAY implement explicit legacy adapters for existing website progress URLs. An adapter MUST parse the URL locally, quarantine its fragment, and derive an HTTPS discovery URL without fetching the fragment-bearing page. Compression is not encryption; a compressed legacy fragment remains sensitive bearer data.

## Size and fallback

Clients and publishers MUST impose conservative decoded and encoded limits. Cached resources, derived UI state, notification IDs, and other reproducible data do not belong in a transfer QR. When a minimal payload exceeds reliable QR capacity, use a separately reviewed encrypted file transfer.
