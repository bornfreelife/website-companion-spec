# Catalogue ordering

A catalogue may opt into the fixed client-owned ordering workflow with `localOrderTracking`. The only version-one grouping key is `vendor`. A conforming client may then let the user record the local lifecycle of each visible offer as not opened, opened, ordered, and, when `arrivalTracking` is true, arrived.

The lifecycle is private user state. Opening a signed product or cart link may advance an untouched offer to opened. Ordered and arrived require explicit user actions. Refreshing signed resources reconciles state by catalogue and stable offer ID; removed offers are discarded, and no state is uploaded to the publisher or vendor.

`combineCompatibleCartUrls` permits the installed client to combine compatible signed HTTPS cart URLs for currently visible offers in the same vendor group. This is a fixed client algorithm, not downloaded code. The client MUST:

- use only URLs whose origins are allowed by the verified manifest;
- combine only a cart format it implements and validates completely;
- refuse mixed origins, malformed identifiers, unsupported paths, and unbounded quantities;
- respect `suggestedOrderQuantity` only within the schema bounds;
- identify when `requiresCartReview` is true and remind the user to review options and quantities on the vendor site; and
- fall back to the individual signed links when a group cannot be combined safely.

The app does not transact, confirm stock, submit payment, claim an order was completed, or bypass vendor authentication and anti-automation controls. The user reviews and completes every purchase on the vendor website.
