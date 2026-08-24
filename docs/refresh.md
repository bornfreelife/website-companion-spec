# Refresh and atomic activation

Automatic refresh is a generic client capability. Publishers may suggest freshness, but cannot force polling frequency or bypass client validation.

## Request privacy

Refresh requests MUST contain only public resource URLs, contract/resource versions, and standard cache validators. They MUST NOT contain user answers, progress, order/preparation state, reminder settings, transfer fragments, a stable device identifier, or a cross-publisher identifier.

## Client behavior

A conforming client provides:

- manual refresh;
- conditional foreground refresh after an app-enforced interval;
- optional best-effort operating-system background refresh;
- retry backoff, jitter, low-power/network awareness, and per-site controls;
- `ETag`/`If-None-Match` and `Last-Modified`/`If-Modified-Since` support;
- immutable versioned resources with SHA-256 digests;
- isolated download and complete validation before activation;
- a retained last-known-good resource set.

Background refresh is opportunistic and MUST NOT be represented as guaranteed.

## Activation classes

The client MAY automatically activate compatible editorial copy, bounded theme tokens/assets, references, prices, and layout composition.

The client MUST request review before applying a change to:

- an action already activated by the user;
- notification timing or recurrence;
- publisher identity, canonical origin, or signing key;
- requested native capabilities;
- permitted external-link origins;
- material safety warnings or meaning.

A valid emergency revocation MAY disable an unsafe resource or link immediately. Export/delete access and a user-facing explanation must remain available.

After activation, state migration and notification reconciliation MUST be transactional. A content/branding update must not reset stable progress, infer recurrence from prose, or silently re-enable a completed or deprecated action.

## Failure handling

Timeouts, invalid signatures, digest mismatches, unsupported schemas/components, empty error responses, revoked keys, and partial downloads MUST leave the last-known-good set active. Diagnostics may disclose public versions and rejection reasons but not private state.
