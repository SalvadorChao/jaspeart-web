from __future__ import annotations

from dataclasses import dataclass

from .extract import ExtractionResult


@dataclass(frozen=True)
class TransformResult:
    brands: list[dict]
    families: list[dict]
    subfamilies: list[dict]
    products: list[dict]
    discarded_rows: list[dict]
    profiling: dict[str, int]
    open_questions: list[str]


def transform_catalog_data(extracted: ExtractionResult) -> TransformResult:
    discarded: list[dict] = []

    brands = []
    seen_brand = set()
    for row in extracted.brands:
        if row.source_brand_id in seen_brand:
            continue
        seen_brand.add(row.source_brand_id)
        brands.append(
            {
                "source_brand_id": row.source_brand_id,
                "name": row.name,
            }
        )

    families = []
    seen_family = set()
    for row in extracted.families:
        if row.source_family_id in seen_family:
            continue
        seen_family.add(row.source_family_id)
        families.append(
            {
                "source_family_id": row.source_family_id,
                "name": row.name,
            }
        )

    products = []
    seen_product = set()
    duplicate_products = 0
    for row in extracted.products:
        if row.erp_code in seen_product:
            duplicate_products += 1
            discarded.append({"entity": "product", "reason": "duplicate_erp_code", "key": row.erp_code})
            continue
        if row.erp_name is None or not str(row.erp_name).strip():
            discarded.append({"entity": "product", "reason": "missing_erp_name", "key": row.erp_code})
            continue
        seen_product.add(row.erp_code)
        products.append(
            {
                "erp_code": row.erp_code,
                "erp_name": row.erp_name,
                "source_brand_id": row.source_brand_id,
                "source_family_id": row.source_family_id,
                "source_subfamily_id": row.source_subfamily_id,
                "imported_from_dw_at": row.imported_from_dw_at,
            }
        )

    profiling = dict(extracted.profiling)
    profiling["duplicate_erp_codes"] = duplicate_products
    profiling["discarded_rows"] = len(discarded)

    return TransformResult(
        brands=brands,
        families=families,
        subfamilies=[],
        products=products,
        discarded_rows=discarded,
        profiling=profiling,
        open_questions=list(extracted.open_questions),
    )
