# Open Questions - Ecommerce Data Model

## Scope

Open questions created from the deep data model analysis for the new JaspeArt ecommerce.

These questions are non-trivial blockers or major decisions for V1.

---

## OQ-DM-01 - Product identity contract with ERP

Question:

Is prod_cod the stable long-term ERP business key for ecommerce sync, including historical corrections and product lifecycle events?

Need to confirm:

- stability guarantees
- uniqueness guarantees
- replacement/deprecation behavior
- aliasing policy if code changes

Impact:

Without this, robust upsert and long-term traceability are at risk.

---

## OQ-DM-02 - Canonical product master completeness

Question:

Can ERP produce a canonical product master that includes all sellable references (including those seen in sales but missing from stock master)?

Need to confirm:

- authoritative source list for sellable references
- treatment of sales-only codes
- latency between product creation and extract availability

Impact:

Missing master coverage can block publication and cause broken product identity.

---

## OQ-DM-03 - Family/subfamily ownership and structure

Question:

What is the authoritative source and governance process for family and subfamily, and can subfamily be reliably used in V1?

Need to confirm:

- subfamily availability and quality
- maintenance ownership
- mapping rules for legacy codes

Impact:

Navigation depth and filter architecture depend on this.

---

## OQ-DM-04 - Commerce taxonomy governance

Question:

Who owns CommerceCategory design and maintenance, and what is the change workflow (business, UX, SEO)?

Need to confirm:

- owner role
- approval flow
- release cadence
- traceability with ERP classification

Impact:

Without governance, taxonomy drifts and UX/search degrade quickly.

---

## OQ-DM-05 - Range/variant grouping key

Question:

Do we have a reliable source key to group references into ProductRange and variants, or must V1 start mostly as standalone products?

Need to confirm:

- grouping key candidate(s)
- per-family feasibility
- fallback behavior when uncertain

Impact:

Wrong grouping can cause wrong purchases; no grouping increases catalog noise.

---

## OQ-DM-06 - Attribute reliability by family

Question:

Which technical attributes are reliable enough per family for filtering, variant selection, and PDP visibility?

Need to confirm:

- coverage thresholds
- unit normalization rules
- controlled value dictionaries

Impact:

Filter UX quality and search relevance depend on this.

---

## OQ-DM-07 - Price ownership and sync contract

Question:

Is ERP the operational master for ecommerce price and VAT display, and what are the synchronization guarantees?

Need to confirm:

- master system
- currency and VAT source semantics
- update frequency/SLA
- conflict resolution policy

Impact:

Pricing trust and legal/commercial correctness can be compromised.

---

## OQ-DM-08 - Stock freshness and reservation policy

Question:

What freshness SLA and reservation behavior are required for V1 stock publication?

Need to confirm:

- acceptable staleness window
- oversell tolerance
- reservation timing (cart vs checkout)
- fallback status policy (UNKNOWN)

Impact:

Critical for availability trust and checkout reliability.

---

## OQ-DM-09 - Publishability rule and exclusions

Question:

What formal rule distinguishes ERP references that are publishable ecommerce products from non-publishable concepts?

Need to confirm:

- treatment of services/workshops/bonuses/gift-card concepts
- mandatory data requirements for publication
- out-of-stock publication policy

Impact:

Directly affects catalog scope, SEO surface, and legal/commercial consistency.

---

## OQ-DM-10 - Media and content operating model

Question:

Who owns media/content quality for product, range, and technique pages in V1 and what minimum standards apply?

Need to confirm:

- owner roles
- required fields
- quality threshold for launch
- maintenance cadence

Impact:

Strongly affects conversion and the inspiration + efficiency goal.

---

## OQ-DM-11 - Orders ownership boundary with ERP

Question:

After checkout, which system is the master for order, payment status, and shipment status, and what are the synchronization directions?

Need to confirm:

- order lifecycle ownership by state
- id mapping between systems
- retry/error handling policy

Impact:

Without this, reconciliation and customer support flows break.
