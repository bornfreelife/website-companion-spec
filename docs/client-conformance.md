# Domain-neutral client conformance

A conforming client implementation satisfies all of the following:

- A fresh install contains no configured publisher and makes no publisher request.
- The signed binary, first-run UI, fixtures, and default configuration contain no hidden or preferred publisher.
- Users can type a conforming publisher URL or activate a conforming HTTPS connection link under the same validation and consent rules.
- QR onboarding relies on the operating system's camera/QR scanner and the client's verified HTTPS handoff association; the client does not require camera permission.
- The neutral reference fixture exercises every generic capability.
- Connected publisher identity and canonical origin remain visible.
- Remote resources are declarative and cannot add undocumented native behavior.
- Connection, validation, rendering, refresh, and failure behavior do not vary based on publisher identity.
- Locally stored state remains isolated by publisher and experience.
- Routine-relative reminders use publisher-declared routine points and offsets plus user-entered local times; clients never infer timing from publisher prose or labels.
- The implementation accurately describes manual connections, publisher-controlled content, local state, refresh behavior, and notifications.

Passing this checklist demonstrates contract behavior only. It is not certification of an implementation or connected publisher.
