# DW to Ecommerce Catalog Sync (V0)

## Scope

This document defines how JaspeArt Ecommerce must obtain current catalog state from the DW before implementing monthly sync logic.

Target flow:

DW -> dw_catalog_sync -> jaspeart_ecommerce

## Sources reviewed

- jaspeart-web:
  - README.md
  - .github/copilot-instructions.md
  - docs/architecture/ecommerce-core-v0.dbml
  - docs/architecture/ecommerce-core-v0.md
  - docs/product/ecommerce-data-model.md
- jaspeart-analytics:
  - sql/dw/dimensions/dimensions_create.sql
  - sql/dw/dimensions/d_producto_insert.sql
  - sql/dw/dimensions/d_marca_insert.sql
  - sql/dw/dimensions/d_familia_insert.sql
  - sql/dw/migration/20260819_split_historical_current_classification.sql
  - sql/staging/create_tables_staging_clean.sql
  - sql/staging/stgclean_producto_insert.sql
  - sql/staging/stgclean_marca_insert.sql
  - sql/staging/stgclean_familia_insert.sql
  - docs/adr/ADR-003-Modelo dimensional DW V1 frente a modelo TO-BE.md
  - docs/adr/ADR-004-Resolucion provisional de familia y marca.md
  - docs/bi/BI-V1-catalogo-funcional.md

## How Ecommerce gets current DW state

| Entity | Business key | DW technical PK | How to identify current version | Source |
|---|---|---|---|---|
| Product | dw.d_producto.prod_cod | dw.d_producto.producto_id | Current row is the single row in dw.d_producto per prod_cod. prod_desc is overwritten from latest stg.producto_clean by (_extract_month desc, _loaded_at desc). marca_id_actual and familia_id_actual are overwritten from latest sales classification in dw.f_ventas by (fecha_registro_erp desc, fecha_documento desc, ticket_id desc, lin_id desc). | sql/dw/dimensions/d_producto_insert.sql |
| Brand | dw.d_marca.mar_desc (normalized description) | dw.d_marca.marca_id | Single current row per mar_desc (unique). Insert-only on conflict do nothing. No SCD2 fields. | sql/dw/dimensions/d_marca_insert.sql, sql/dw/dimensions/dimensions_create.sql |
| Family | dw.d_familia.fam_cod | dw.d_familia.familia_id | Single current row per fam_cod (unique). fam_desc is overwritten by upsert from latest stg.familia_clean by (_extract_month desc, _loaded_at desc). | sql/dw/dimensions/d_familia_insert.sql, sql/dw/dimensions/dimensions_create.sql |
| Subfamily | Not established in dw schema | Not established in dw schema | No dw.d_subfamilia table found. landing.subfamilia_raw exists but is not promoted to stg clean or dw dimension in V1, and has no explicit family linkage column. | sql/staging/create_tables_staging_clean.sql, DB schema inspection, ADR-003, BI-V1 docs |

## Findings by certainty

### HECHO

- dw.d_producto has PK producto_id and unique prod_cod.
- dw.d_familia has PK familia_id and unique fam_cod.
- dw.d_marca has PK marca_id and unique mar_desc.
- d_producto current classification is explicitly split:
  - historical values in dw.f_ventas.familia_id_historica / marca_id_historica
  - current values in dw.d_producto.familia_id_actual / marca_id_actual
- The SQL that sets d_producto current classification uses row_number with ordering:
  - fecha_registro_erp desc nulls last
  - fecha_documento desc nulls last
  - ticket_id desc
  - lin_id desc
- _extract_month is documented as ETL batch metadata, not business date.
- There is no dw V1 subfamily dimension currently implemented.
- landing.subfamilia_raw currently has columns:
  - falm_sfami_cod
  - falm_sfami_desc
  - _source_file
  - _extract_month
  - _loaded_at
  - _row_hash
- landing.subfamilia_raw has no explicit family reference column.

### INFERENCIA

- Product current family/brand can lag the latest loaded fact month if dimensions are loaded before facts in monthly pipeline.
  - run_pipeline loads Dimensions stage before Facts stage.
  - observed mismatch exists between d_producto current fields and latest f_ventas-derived classification for latest month rows.
- For ecommerce V0, using d_producto as current-state source is still consistent with DW ownership, but this behavior must be documented as a DW pipeline characteristic.

### OPEN QUESTION

- OQ-SUBFAMILY-001: What is the authoritative current-state source for subfamily in DW V1?
  - There is no dw subfamily dimension.
  - landing.subfamilia_raw is not integrated into stg/dw current model.
  - Ecommerce subfamily requires source_subfamily_id + family_id + name, but reliable family linkage for subfamily is not currently evidenced.

## Read-only data profiling summary

Executed in PostgreSQL with read-only session setting:

- Product (dw.d_producto)
  - total rows: 21087
  - distinct prod_cod: 21087
  - null/blank prod_cod: 0
  - null/blank prod_desc: 448
  - without familia_id_actual: 5452
  - without marca_id_actual: 5573
- Family (dw.d_familia)
  - total rows: 36
  - distinct fam_cod: 36
  - null/blank fam_cod: 0
  - null/blank fam_desc: 0
- Brand (dw.d_marca)
  - total rows: 360
  - distinct mar_desc: 360
  - null/blank mar_desc: 0
- Staging version signals
  - stg.producto_clean keys with >1 row: 21028
  - stg.familia_clean keys with >1 row: 36
  - stg.marca_clean descriptions with >1 row: 359
  - stg.producto_clean prod_cod with >1 distinct description: 339
  - stg.marca_clean mar_desc with >1 mar_cod: 12
  - stg.familia_clean fam_desc with >1 fam_cod: 0
- Fact classification quality
  - dw.f_ventas total rows: 225844
  - dw.f_ventas null producto_id: 4
  - dw.f_ventas null familia_id_historica: 317
  - dw.f_ventas null marca_id_historica: 9826
  - products whose historical classification changes over time: 2660

## Sync contract implications for V0

- DW sync MAY update only DW-owned ecommerce fields:
  - brand.source_brand_id, brand.name
  - family.source_family_id, family.name
  - subfamily.source_subfamily_id, subfamily.family_id, subfamily.name (blocked by OQ-SUBFAMILY-001)
  - product.erp_code, product.erp_name, product.brand_id, product.family_id, product.subfamily_id, product.imported_from_dw_at
- DW sync MUST NOT update ecommerce/ERP-owned fields:
  - commerce_name, slug, short_description, long_description, range_id
  - is_published
  - price, vat_rate, price_synced_at
  - stock_quantity, stock_status, stock_synced_at
  - product_range or product_image entities

## Manual execution plan (monthly)

Expected command shape after implementation:

- Dry run sample:
  - python -m dw_catalog_sync.main --dry-run --limit 100
- Sample write:
  - python -m dw_catalog_sync.main --limit 100
- Full run:
  - python -m dw_catalog_sync.main

Required env vars:

- DW_DATABASE_URL
- ECOMMERCE_DATABASE_URL

Important:

- DW connection must run in read-only transaction mode.
- No deletes for missing keys in source extraction.
- Upserts must be idempotent and update only DW-owned columns.
