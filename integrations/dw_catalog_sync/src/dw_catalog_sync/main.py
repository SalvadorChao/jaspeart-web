from __future__ import annotations

import argparse
import json
import logging

from .config import Settings, load_settings
from .extract import extract_current_dw_catalog
from .load import load_catalog_to_ecommerce
from .transform import transform_catalog_data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync DW current catalog state into ecommerce catalog tables")
    parser.add_argument("--limit", type=int, default=None, help="Limit products and required masters for sample run")
    parser.add_argument("--dry-run", action="store_true", help="Compute changes without writing to ecommerce DB")
    return parser.parse_args()


def _build_summary(extracted, transformed, loaded, dry_run: bool, limit: int | None) -> dict:
    families = {p["source_family_id"] for p in transformed.products if p["source_family_id"]}
    brands = {p["source_brand_id"] for p in transformed.products if p["source_brand_id"]}
    with_subfamily = sum(1 for p in transformed.products if p["source_subfamily_id"])

    return {
        "mode": "dry-run" if dry_run else "write",
        "limit": limit,
        "open_questions": transformed.open_questions,
        "sample": {
            "products": len(transformed.products),
            "families_represented": len(families),
            "brands_represented": len(brands),
            "products_with_subfamily": with_subfamily,
        },
        "extract_profiling": extracted.profiling,
        "sync": {
            "brand": vars(loaded.brand),
            "family": vars(loaded.family),
            "subfamily": vars(loaded.subfamily),
            "product": vars(loaded.product),
        },
        "diagnostics": loaded.diagnostics,
    }


def run(settings: Settings, limit: int | None, dry_run: bool) -> dict:
    extracted = extract_current_dw_catalog(settings.dw_database_url, limit=limit)
    transformed = transform_catalog_data(extracted)
    loaded = load_catalog_to_ecommerce(settings.ecommerce_database_url, transformed, dry_run=dry_run)
    return _build_summary(extracted, transformed, loaded, dry_run=dry_run, limit=limit)


def main() -> int:
    args = parse_args()
    settings = load_settings()

    logging.basicConfig(level=getattr(logging, settings.log_level, logging.INFO))

    summary = run(settings, limit=args.limit, dry_run=args.dry_run)
    print(json.dumps(summary, ensure_ascii=True, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
