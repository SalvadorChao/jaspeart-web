from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable

import psycopg
from psycopg.rows import dict_row


@dataclass(frozen=True)
class BrandSource:
    source_brand_id: str
    name: str


@dataclass(frozen=True)
class FamilySource:
    source_family_id: str
    name: str


@dataclass(frozen=True)
class SubfamilySource:
    source_subfamily_id: str
    source_family_id: str
    name: str


@dataclass(frozen=True)
class ProductSource:
    erp_code: str
    erp_name: str | None
    source_brand_id: str | None
    source_family_id: str | None
    source_subfamily_id: str | None
    imported_from_dw_at: datetime


@dataclass(frozen=True)
class ExtractionResult:
    brands: list[BrandSource]
    families: list[FamilySource]
    subfamilies: list[SubfamilySource]
    products: list[ProductSource]
    profiling: dict[str, int]
    open_questions: list[str]


def _choose_sample_products(rows: list[dict], limit: int) -> list[dict]:
    if limit <= 0 or len(rows) <= limit:
        return rows

    buckets: dict[str, list[dict]] = {}
    for row in rows:
        family_key = row.get("source_family_id") or "__NO_FAMILY__"
        buckets.setdefault(family_key, []).append(row)

    for key in buckets:
        buckets[key].sort(key=lambda r: (r.get("erp_code") or ""))

    selected: list[dict] = []
    active_keys = sorted(buckets.keys())
    cursor = 0
    while len(selected) < limit and active_keys:
        key = active_keys[cursor % len(active_keys)]
        bucket = buckets[key]
        if bucket:
            selected.append(bucket.pop(0))
        if not bucket:
            active_keys.remove(key)
            if not active_keys:
                break
            cursor = cursor % len(active_keys)
            continue
        cursor += 1

    return selected


def _extract_products(cur: psycopg.Cursor, limit: int | None) -> list[dict]:
    cur.execute(
        """
        SELECT
            p.prod_cod AS erp_code,
            p.prod_desc AS erp_name,
            m.mar_desc AS source_brand_id,
            m.mar_desc AS brand_name,
            f.fam_cod AS source_family_id,
            f.fam_desc AS family_name
        FROM dw.d_producto p
        LEFT JOIN dw.d_marca m ON p.marca_id_actual = m.marca_id
        LEFT JOIN dw.d_familia f ON p.familia_id_actual = f.familia_id
        WHERE NULLIF(BTRIM(p.prod_cod), '') IS NOT NULL
        ORDER BY p.prod_cod
        """
    )
    rows = list(cur.fetchall())
    if limit is None:
        return rows
    return _choose_sample_products(rows, limit)


def _extract_brands(cur: psycopg.Cursor, only_ids: set[str] | None) -> list[BrandSource]:
    if only_ids is None:
        cur.execute(
            """
            SELECT mar_desc
            FROM dw.d_marca
            WHERE NULLIF(BTRIM(mar_desc), '') IS NOT NULL
            ORDER BY mar_desc
            """
        )
    else:
        cur.execute(
            """
            SELECT mar_desc
            FROM dw.d_marca
            WHERE mar_desc = ANY(%s)
            ORDER BY mar_desc
            """,
            (sorted(only_ids),),
        )

    result = []
    for row in cur.fetchall():
        mar_desc = (row["mar_desc"] or "").strip()
        if not mar_desc:
            continue
        result.append(BrandSource(source_brand_id=mar_desc, name=mar_desc))
    return result


def _extract_families(cur: psycopg.Cursor, only_ids: set[str] | None) -> list[FamilySource]:
    if only_ids is None:
        cur.execute(
            """
            SELECT fam_cod, fam_desc
            FROM dw.d_familia
            WHERE NULLIF(BTRIM(fam_cod), '') IS NOT NULL
            ORDER BY fam_cod
            """
        )
    else:
        cur.execute(
            """
            SELECT fam_cod, fam_desc
            FROM dw.d_familia
            WHERE fam_cod = ANY(%s)
            ORDER BY fam_cod
            """,
            (sorted(only_ids),),
        )

    result = []
    for row in cur.fetchall():
        fam_cod = (row["fam_cod"] or "").strip()
        if not fam_cod:
            continue
        fam_desc = (row["fam_desc"] or "").strip()
        result.append(FamilySource(source_family_id=fam_cod, name=fam_desc or fam_cod))
    return result


def extract_current_dw_catalog(dw_database_url: str, limit: int | None = None) -> ExtractionResult:
    open_questions: list[str] = []

    with psycopg.connect(dw_database_url, row_factory=dict_row) as conn:
        with conn.transaction():
            with conn.cursor() as cur:
                cur.execute("SET TRANSACTION READ ONLY")

                products_rows = _extract_products(cur, limit)

                brand_filter = {r["source_brand_id"] for r in products_rows if r.get("source_brand_id")}
                family_filter = {r["source_family_id"] for r in products_rows if r.get("source_family_id")}

                brands = _extract_brands(cur, None if limit is None else brand_filter)
                families = _extract_families(cur, None if limit is None else family_filter)

                open_questions.append(
                    "Subfamily current-state source not established in DW V1: no dw dimension and no reliable family linkage in landing.subfamilia_raw."
                )

    imported_at = datetime.now(timezone.utc)
    products = [
        ProductSource(
            erp_code=(row["erp_code"] or "").strip(),
            erp_name=(row.get("erp_name") or None),
            source_brand_id=row.get("source_brand_id"),
            source_family_id=row.get("source_family_id"),
            source_subfamily_id=None,
            imported_from_dw_at=imported_at,
        )
        for row in products_rows
        if (row.get("erp_code") or "").strip()
    ]

    profiling = {
        "products_read": len(products),
        "brands_read": len(brands),
        "families_read": len(families),
        "subfamilies_read": 0,
        "products_without_brand": sum(1 for p in products if not p.source_brand_id),
        "products_without_family": sum(1 for p in products if not p.source_family_id),
        "products_without_subfamily": len(products),
    }

    return ExtractionResult(
        brands=brands,
        families=families,
        subfamilies=[],
        products=products,
        profiling=profiling,
        open_questions=open_questions,
    )
