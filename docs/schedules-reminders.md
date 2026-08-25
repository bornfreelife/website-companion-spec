# Schedules and local reminders

Schedule resources describe public planner groups. They do not grant notification permission or schedule anything by themselves. The client owns user consent, local times, protected state, delivery policy, and reconciliation.

## Routine points

A publisher may declare bounded `routinePoints` such as `day-start`, `first-meal`, or `shift-end`. Each point has a stable ID and user-facing label. These are publisher-defined labels rather than client-defined domains.

A `timeAnchor` may contain a `relativeTo` relationship with a routine-point ID and an authored minute offset. The user supplies the routine point's local clock time. The client derives that time anchor from the local clock time plus the signed offset. A time anchor without `relativeTo` remains manually timed by the user.

Clients MUST:

- validate unique routine-point and time-anchor IDs and reject unknown relationships;
- keep routine times and enabled reminder groups in publisher/experience-namespaced private state;
- require explicit enablement and operating-system permission before scheduling;
- compute relationships from structured fields only, never from labels, instructions, reminder copy, item names, or domain vocabulary;
- treat publisher offsets as suggestions for a local summary, not as permission to infer recurrence, dosage, urgency, or an instruction to act;
- reconcile changed or removed points and relationships against the currently verified package;
- coalesce enabled groups that resolve to the same local time where platform limits or interruption reduction require it; and
- keep the planner authoritative because the operating system may delay, group, suppress, or remove notifications.

Routine points and relationships are optional. A client that supports schedule schema `1.0` but not routine-relative reminders MUST fail the affected capability closed rather than silently inventing times.
