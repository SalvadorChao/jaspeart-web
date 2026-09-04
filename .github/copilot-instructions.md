# GitHub Copilot Instructions — JaspeArt Web

## Project context

This repository contains the new web/ecommerce project for **JaspeArt**, a business specialized in Fine Arts materials, products and related services.

The project is currently evolving from **discovery and product definition toward implementation**.

Do not assume that architectural or business decisions have already been made unless they are explicitly documented in this repository.

## Reference sources and working rules

The repository includes a `reference/` area used as evidence and context, not as a source of binding architecture decisions.

- `reference/` is read-only by default.
- `reference/wordpress-as-is/` is the technical and functional reference for the legacy WordPress/ WooCommerce system and related integrations. It is AS-IS evidence only.
- `reference/lovable-prototype/` is the UX/UI reference for approved visual and interaction work. It is a design and prototyping source, not automatically production-ready code.
- Neither folder defines the target architecture by itself.
- Inspect both references when relevant before implementing, but do not treat them as authoritative design decisions without project approval.
- Do not modify files under either reference folder unless the task explicitly requests it.
- Do not copy code automatically from either source without evaluating compatibility, quality, maintainability and target architecture.
- Do not invent business rules when information is missing in the AS-IS, the prototype or the approved product specification.

---

# Core working principles

## 1. Understand before implementing

Before making a significant change:

1. understand the request;
2. inspect the relevant existing code and documentation;
3. identify dependencies and affected areas;
4. distinguish known facts from assumptions;
5. implement only after the required behavior is sufficiently clear.

Do not generate large amounts of code before understanding the problem.

For small, mechanical and clearly scoped tasks, avoid unnecessary analysis.

---

## 2. Never invent business rules

Do not invent JaspeArt business behavior.

This is especially important for:

* product publication;
* catalogue eligibility;
* prices;
* VAT;
* stock;
* availability;
* promotions;
* discounts;
* gift cards or vouchers;
* shipping;
* store pickup;
* returns;
* payments;
* customers;
* orders;
* services;
* workshops;
* courses;
* framing;
* restorations.

If required behavior is unclear and cannot be determined from the repository, explicitly identify the uncertainty.

Do not silently choose a plausible business rule.

---

## 3. Distinguish facts, assumptions and decisions

When analyzing non-trivial work, distinguish between:

* **Known fact** — supported by code, documentation or verified project context.
* **Assumption** — plausible but not confirmed.
* **Decision** — deliberately selected project behavior or architecture.

Never present an assumption as an established project decision.

---

## 4. Use Open Questions for unresolved business knowledge

Important unresolved questions should be treated as **Open Questions (OQ)**.

An OQ represents missing knowledge or a decision that still requires validation.

Do not resolve an OQ by inventing an answer in code.

When an unresolved question blocks safe implementation, stop and explain what needs to be decided.

---

## 5. Use ADRs for architectural decisions

Important architectural decisions should be documented using **Architecture Decision Records (ADR)** when the project documentation structure supports them.

Examples include:

* frontend framework;
* backend architecture;
* ecommerce platform;
* WordPress/WooCommerce role;
* search technology;
* catalogue integration;
* stock integration;
* pricing integration;
* authentication;
* payments;
* hosting;
* CMS;
* image strategy;
* analytics architecture;
* SEO architecture.

An ADR records a decision that has been made.

Do not create an ADR merely to document an unresolved question.

---

# Architecture principles

## 6. Separate WHAT from HOW

Always distinguish functional requirements from technical implementation.

Example:

Functional requirement:

> A customer must be able to quickly find a brush by type and size.

Technical implementation:

> Use a particular search engine or indexing technology.

Do not select implementation technology when only the functional requirement has been established.

---

## 7. Do not assume the stack

Unless explicitly established by current repository decisions, do not assume that the project must use:

* Next.js;
* React;
* Vue;
* WordPress;
* WooCommerce;
* Shopify;
* Medusa;
* Saleor;
* Magento;
* a headless architecture;
* a custom backend;
* a monolith;
* microservices;
* any particular cloud provider.

Inspect existing project decisions before proposing or introducing architectural dependencies.

---

## 8. WordPress is currently an architectural input, not a predetermined answer

JaspeArt currently has an existing WordPress-based website/ecommerce.

Do not assume that WordPress must:

* remain;
* disappear;
* become headless;
* become the backend of the new frontend.

The existing system must be evaluated based on evidence.

Avoid destructive migration assumptions.

---

## 9. Do not use the Data Warehouse as an operational backend by default

JaspeArt has a separate Data Warehouse / BI project.

Knowledge derived from that project may inform ecommerce decisions.

However, do not assume that the DW is the operational source for:

* stock;
* prices;
* availability;
* customers;
* orders;
* payments.

Operational data must come from the appropriate source systems unless an explicit architectural decision says otherwise.

---

## 10. Respect data ownership

Business data must have clear ownership.

Do not place authoritative business logic in UI components when it belongs to another system or domain layer.

The frontend must not become the master system for:

* price;
* stock;
* product classification;
* availability;
* promotions;
* commercial rules.

---

## 11. Never patch master-data problems in the UI

Do not implement product-specific exceptions such as:

```text
if product X:
    force category Y
```

to compensate for incorrect master data.

If classification or another master-data field is incorrect, identify the underlying data issue.

Fix it in the appropriate source or transformation layer when that ownership is known.

---

# Catalogue principles

## 12. Internal catalogue does not equal ecommerce catalogue

JaspeArt has an internal catalogue containing approximately 21,000 references.

Do not assume that every internal record:

* is an ecommerce product;
* is active;
* is available;
* has stock;
* has a valid price;
* contains sufficient product information;
* should be publicly visible;
* should be indexed by search engines.

The project will define an explicit **ecommerce publication rule**.

Do not invent that rule.

---

## 13. Not everything is a physical product

Existing systems may contain concepts including:

* physical products;
* workshops;
* courses;
* restorations;
* framing;
* specific/custom work;
* vouchers;
* gift cards;
* other services or special concepts.

Do not assume they all use the same ecommerce lifecycle or checkout.

Some may eventually require booking, contact, quotation, appointment or other journeys.

Only implement confirmed behavior.

---

# UX and ecommerce principles

## 14. Optimize for inspiration AND efficient purchasing

JaspeArt should combine:

* visual discovery;
* editorial inspiration;
* specialist Fine Arts knowledge;
* efficient product finding and purchasing.

A visually sophisticated interface must not make technical product discovery harder.

---

## 15. Product discovery is critical

The catalogue can contain many technically similar references.

Treat the following as important product capabilities:

* navigation;
* search;
* categories;
* families;
* subfamilies;
* brands;
* filters;
* sorting;
* PLP;
* PDP.

Do not sacrifice findability for visual minimalism.

---

## 16. Responsive design is a first-class requirement.

Design and implement desktop, tablet and mobile behavior deliberately from the beginning.
Do not build a desktop-only experience and treat mobile as a later adaptation.
Critical ecommerce journeys must work especially well on mobile.

---

## 17. Accessibility is part of implementation

Consider accessibility while building components.

Pay attention to:

* semantic HTML;
* keyboard navigation;
* focus states;
* labels;
* form errors;
* contrast;
* alt text;
* interactive states.

Do not treat accessibility exclusively as a final QA task.

---

## 18. Performance is a product requirement

Avoid unnecessary client-side complexity.

Pay particular attention to:

* LCP;
* images;
* JavaScript payload;
* catalogue rendering;
* PLP performance;
* search interactions;
* caching;
* mobile performance.

Do not introduce heavy dependencies without justification.

---

## 19. SEO must survive architectural changes

There is an existing website with potential SEO value.

Do not casually change:

* public URLs;
* slugs;
* category structures;
* canonical behavior;
* redirects;
* metadata;
* indexability.

Migration implications must be considered before changing existing public URL structures.

---

# Implementation quality

## 20. AI-generated code has the same quality requirements as human-written code

All generated code must be:

* understandable;
* reviewable;
* testable;
* maintainable;
* versionable;
* deployable;
* reversible.

Do not optimize for producing the largest amount of code.

Optimize for producing the smallest correct and maintainable change.

---

## 21. Prefer simple solutions

Avoid overengineering.

Do not introduce:

* unnecessary abstractions;
* speculative extensibility;
* premature microservices;
* unnecessary dependencies;
* duplicate state;
* excessive configuration;
* abstraction layers without a current use case.

Use the simplest solution that correctly satisfies confirmed requirements.

---

## 22. Reuse before duplicating

Before creating a new component, utility, hook, service or pattern:

1. inspect the existing codebase;
2. determine whether an equivalent already exists;
3. extend or reuse it when appropriate.

Avoid creating multiple components that solve almost the same problem.

---

## 23. Keep responsibilities clear

Avoid mixing:

* UI rendering;
* domain logic;
* data access;
* integrations;
* analytics;
* configuration.

Keep responsibilities in appropriate layers according to the architecture established by the project.

---

## 24. Avoid hardcoding

Do not hardcode business rules, environment-specific URLs, credentials or operational values into UI components.

Use appropriate configuration or domain layers.

Never commit:

* secrets;
* passwords;
* API keys;
* tokens;
* database credentials;
* private connection strings.

---

## 25. Handle failures deliberately

Do not silently swallow errors.

Implement appropriate:

* validation;
* error states;
* loading states;
* empty states;
* logging;
* recovery behavior.

User-facing failures should be understandable without exposing sensitive implementation details.

---

# Testing

## 26. Test meaningful behavior

When implementing functionality, add or update tests when appropriate.

Prioritize testing:

* business behavior;
* transformations;
* interactions;
* edge cases;
* regressions;
* critical ecommerce journeys.

Avoid tests that merely reproduce implementation details without protecting useful behavior.

---

## 27. Do not fabricate production integrations in tests

Mocks and fixtures are allowed for development and testing.

Clearly distinguish them from real operational data.

Never present invented values as real JaspeArt data.

---

# Working with the repository

## 28. Inspect before modifying

Before a non-trivial change, inspect:

* relevant files;
* nearby components;
* existing conventions;
* documentation;
* configuration;
* tests.

Follow established repository patterns unless there is a justified reason to change them.

---

## 29. Keep changes scoped

Make the smallest coherent change that satisfies the request.

Do not opportunistically refactor unrelated areas.

If you discover a separate problem, report it instead of silently expanding the scope.

---

## 30. Do not perform destructive Git operations unless explicitly requested

Do not:

* force push;
* rewrite shared history;
* delete branches;
* delete unrelated files;
* reset unrelated user changes;
* discard uncommitted work

unless explicitly instructed.

Never overwrite user work simply to make the working tree clean.

---

## 31. Do not commit or push unless explicitly requested

Implementation and Git publication are separate actions.

Unless the user explicitly asks:

* do not commit;
* do not push;
* do not merge;
* do not create releases.

You may prepare changes and report what is ready.

---

# AI workflow

The expected workflow may involve:

**ChatGPT → specification / architecture**

**Lovable → visual exploration / prototypes**

**Git → source of truth**

**GitHub Copilot → implementation / refactoring / testing**

Do not assume that prototype code generated by Lovable or another AI tool is production-ready.

Code entering the real product must satisfy this repository's architecture, testing, accessibility, performance and maintainability standards.

---

# Final rule

When there is tension between:

**doing something quickly**

and

**inventing an important business or architectural decision**

do not invent the decision.

Identify the uncertainty and request clarification.

Use AI to accelerate execution — not to accelerate arbitrary decisions.
