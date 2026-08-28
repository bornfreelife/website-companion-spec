# Catalogue regional selection

Catalogue resources may optionally declare a bounded `regionalSelection` policy. The policy names the local choice that contains a region, the stable offer field used to form alternative groups, and an ordered list of publisher-defined region codes to try for each choice value.

For each alternative group, the client first applies ordinary offer and linked-action visibility. Offers without a `regions` restriction remain visible. For the remaining eligible offers, the client selects the first region in the chosen region's `fallbackOrder` that has at least one offer and shows only offers in that selected region. An offer lacking the declared grouping field is treated as its own group.

Clients MUST:

- evaluate the policy entirely against local choices and signed catalogue data;
- validate that the named choice exists and that every fallback region is declared by the catalogue;
- group only by the declared `actionId` or `recommendationGroup` field;
- apply fallback after choice/action visibility, so an ineligible alternative cannot suppress an eligible fallback;
- preserve publisher order or the documented bounded rank ordering within the selected region; and
- send neither the selected region nor any other local choice to the publisher.

The policy is intentionally data-driven. Region codes such as `ALT`, `US`, or `DEMO` have no built-in client meaning. A client must not invent a country hierarchy or silently fall back to a region that the signed publisher did not declare.

Without `regionalSelection`, the catalogue retains exact-region behavior for backwards compatibility.
