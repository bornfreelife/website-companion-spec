# Discovery resolution

Status: draft.

A QR connection carries an explicit absolute HTTPS discovery URL. Manual connection may begin with either a discovery URL, a compatible publisher page, or a site URL. Clients must resolve those inputs without executing publisher code or transmitting a URL fragment.

## Resolution order

The client must first parse the user-supplied URL locally, reject embedded credentials and disallowed network targets, and quarantine any fragment. It may then use the following bounded sequence:

1. If the fragment-free input path ends in `/.well-known/website-companion.json`, fetch it as discovery.
2. Otherwise request the fragment-free HTTPS URL without cookies or app-local identifiers and follow only policy-compliant HTTPS redirects.
3. Accept an HTTP `Link` header with `rel="website-companion"` and an absolute or same-origin HTTPS target.
4. When the response is bounded HTML, accept a head element of the form `<link rel="website-companion" type="application/json" href="...">` without executing, rendering, or retaining the document.
5. As a fallback, probe `/.well-known/website-companion.json` at the final response origin.
6. If no single valid target is found, stop and ask the user for a discovery URL or connection QR.

Clients must reject duplicate or conflicting advertised discovery targets, non-HTTPS targets, targets containing credentials or fragments, cross-origin targets unless the user explicitly confirms the changed origin, redirect loops, oversized headers/documents, and responses outside the client network policy.

## Publisher requirements

A publisher whose application lives below an origin root, such as `/community/`, should expose both an HTTP `Link` response header and an HTML `link` element on compatible pages. This lets a user enter the visible page URL even when server ownership prevents the application from writing the origin-root well-known path.

The advertised URL is only a locator. The client still performs the normal publisher preview, trust-on-first-use, schema, signature, origin, compatibility, and resource validation flow before activation.
