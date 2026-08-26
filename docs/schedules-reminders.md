# Schedules and local reminders

Schedule resources describe public planner groups. They do not grant notification permission or schedule anything by themselves. The client owns user consent, local times, protected state, delivery policy, and reconciliation.

## Routine points

A publisher may declare bounded `routinePoints` such as `day-start`, `first-meal`, or `shift-end`. Each point has a stable ID and user-facing label. These are publisher-defined labels rather than client-defined domains. A point may also include `suggestedLocalTime` as a visible starting value. It is not an enabled reminder, and the user remains free to change or clear it.

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

## Daily completion

A schedule may declare `completionPolicy: { scope: "daily", resetAtRoutinePointId: "..." }`. This makes planner ticks local daily state rather than permanent completion. The referenced routine point defines when the next local planner day begins. Its user-configured time takes precedence over the publisher's visible suggestion; if no usable time is available, a supporting client uses local midnight.

Clients that implement this policy MUST:

- keep daily ticks separate from permanent checklist completion;
- reset daily ticks when the local clock crosses the declared boundary, including after the app resumes;
- retain today's ticks only for notification occurrences in the same planner day, so checking an item today does not suppress tomorrow's reminder;
- let the user explicitly start a fresh checklist without changing the signed schedule or the locally selected step; and
- validate the referenced routine point without inferring day boundaries from IDs, labels, instructions, or domain vocabulary.

If `completionPolicy` is absent, planner completion does not reset automatically.

## Cumulative steps

A schedule item may carry optional `activation` metadata. Without it, the item is scoped to its own current step for backwards compatibility. `scope: current-step` keeps that behavior. `scope: from-step` keeps the item active after its step has been reached.

Publishers may also provide a stable `seriesId`. An item with `replacesEarlier: true` replaces earlier active items in the same series. When the replacing item is current-step scoped, earlier items with `retainWhenReplaced: true` remain active. These fields let a publisher encode cumulative and replacement behavior without requiring a client to interpret item labels, categories, or instructions.

Clients MUST:

- consider only steps up to and including the locally selected current step;
- process items in signed step and item order;
- apply current-step scope and structured replacement fields before rendering or scheduling notifications;
- use the same active-item calculation for the planner and reminder reconciliation; and
- recalculate scheduled reminders whenever the selected step or verified schedule changes.
