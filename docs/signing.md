# Signing and trust

Status: draft cryptographic profile.

## Initial trust

The user supplies an HTTPS discovery URL. TLS authenticates the initial origin. The client displays the publisher identity and canonical origin before connection, then stores the accepted origin and signing key using trust on first use.

The discovery document publishes current verification keys and the manifest URL. A key in the same discovery response does not independently authenticate that first response; it provides continuity for later manifests and refreshes.

## Manifest signature profile

Draft 0.1 uses:

- algorithm: Ed25519;
- public-key representation: JWK with `kty=OKP`, `crv=Ed25519`;
- canonicalization: RFC 8785 JSON Canonicalization Scheme;
- digest references: lowercase SHA-256 hex;
- signature encoding: unpadded base64url of the raw Ed25519 signature.

To sign, remove the top-level `signature` member, canonicalize the remaining manifest, and sign those bytes. Clients MUST reject an unknown algorithm, key ID, invalid signature, expired manifest, duplicate JSON member, unsupported schema, or resource digest mismatch.

## Key continuity and rotation

A new key is accepted automatically only when a rotation statement is signed by a currently trusted, non-revoked key. Otherwise the client requires explicit publisher re-approval and explains that identity verification could not be continued.

Clients maintain a revocation state and can suspend a key/origin locally. Rollback to an older manifest is rejected unless a narrowly defined, signed recovery mechanism authorizes it.

## Production work remaining

Before 1.0, publish canonical signing vectors, invalid vectors, rotation/revocation schemas, maximum validity windows, clock-skew rules, rollback rules, and independent cryptographic review. The 0.1 profile is not production approval.
