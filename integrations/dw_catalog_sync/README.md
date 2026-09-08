# dw_catalog_sync

Python sync utility for DW -> Ecommerce Core Catalog V0.

## Usage

Set environment variables:

- DW_DATABASE_URL
- ECOMMERCE_DATABASE_URL

Run:

- Dry run sample: python -m dw_catalog_sync.main --dry-run --limit 100
- Sample write: python -m dw_catalog_sync.main --limit 100
- Full write: python -m dw_catalog_sync.main
