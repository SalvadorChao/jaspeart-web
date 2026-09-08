from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

import psycopg
from psycopg.rows import dict_row

from .transform import TransformResult


@dataclass
class EntityMetrics:
    read: int = 0
    inserted: int = 0
    updated: int = 0
    unchanged: int = 0
    errors: int = 0


@dataclass
class SyncResult:
    brand: EntityMetrics
    family: EntityMetrics
    subfamily: EntityMetrics
    product: EntityMetrics
    diagnostics: dict[str, int]


def compute_change(existing: dict[str, Any], incoming: dict[str, Any], columns: list[str]) -> bool:
    return any(existing.get(col) != incoming.get(col) for col in columns)


def apply_product_dw_fields(existing: dict[str, Any], incoming: dict[str, Any]) -> dict[str, Any]:
    updated = dict(existing)
    for field in [
        "erp_name",
        "brand_id",
        "family_id",
        "subfamily_id",
        "imported_from_dw_at",
    ]:
        updated[field] = incoming.get(field)
    return updated


def _sync_brand(cur: psycopg.Cursor, brands: list[dict], dry_run: bool) -> tuple[EntityMetrics, dict[str, str]]:
    metrics = EntityMetrics(read=len(brands))
    cur.execute("SELECT id, source_brand_id, name FROM brand WHERE source_brand_id IS NOT NULL")
    existing = {row["source_brand_id"]: row for row in cur.fetchall()}

    id_map: dict[str, str] = {}
    for row in brands:
        key = row["source_brand_id"]
        found = existing.get(key)

        if not found:
            metrics.inserted += 1
            if not dry_run:
                cur.execute(
                    """
                    INSERT INTO brand (source_brand_id, name)
                    VALUES (%s, %s)
                    RETURNING id
                    """,
                    (key, row["name"]),
                )
                id_map[key] = cur.fetchone()["id"]
            else:
                id_map[key] = f"dryrun-brand-{key}"
            continue

        id_map[key] = found["id"]
        if compute_change(found, row, ["name"]):
            metrics.updated += 1
            if not dry_run:
                cur.execute("UPDATE brand SET name = %s WHERE id = %s", (row["name"], found["id"]))
        else:
            metrics.unchanged += 1

    return metrics, id_map


def _sync_family(cur: psycopg.Cursor, families: list[dict], dry_run: bool) -> tuple[EntityMetrics, dict[str, str]]:
    metrics = EntityMetrics(read=len(families))
    cur.execute("SELECT id, source_family_id, name FROM family WHERE source_family_id IS NOT NULL")
    existing = {row["source_family_id"]: row for row in cur.fetchall()}

    id_map: dict[str, str] = {}
    for row in families:
        key = row["source_family_id"]
        found = existing.get(key)

        if not found:
            metrics.inserted += 1
            if not dry_run:
                cur.execute(
                    """
                    INSERT INTO family (source_family_id, name)
                    VALUES (%s, %s)
                    RETURNING id
                    """,
                    (key, row["name"]),
                )
                id_map[key] = cur.fetchone()["id"]
            else:
                id_map[key] = f"dryrun-family-{key}"
            continue

        id_map[key] = found["id"]
        if compute_change(found, row, ["name"]):
            metrics.updated += 1
            if not dry_run:
                cur.execute("UPDATE family SET name = %s WHERE id = %s", (row["name"], found["id"]))
        else:
            metrics.unchanged += 1

    return metrics, id_map


def _sync_subfamily(cur: psycopg.Cursor, subfamilies: list[dict], family_ids: dict[str, str], dry_run: bool) -> tuple[EntityMetrics, dict[str, str], int]:
    metrics = EntityMetrics(read=len(subfamilies))
    unresolved_family = 0
    id_map: dict[str, str] = {}

    if not subfamilies:
        return metrics, id_map, unresolved_family

    cur.execute("SELECT id, source_subfamily_id, family_id, name FROM subfamily WHERE source_subfamily_id IS NOT NULL")
    existing = {row["source_subfamily_id"]: row for row in cur.fetchall()}

    for row in subfamilies:
        key = row["source_subfamily_id"]
        family_id = family_ids.get(row["source_family_id"])
        if not family_id:
            unresolved_family += 1
            metrics.errors += 1
            continue

        incoming = {
            "source_subfamily_id": key,
            "family_id": family_id,
            "name": row["name"],
        }
        found = existing.get(key)

        if not found:
            metrics.inserted += 1
            if not dry_run:
                cur.execute(
                    """
                    INSERT INTO subfamily (source_subfamily_id, family_id, name)
                    VALUES (%s, %s, %s)
                    RETURNING id
                    """,
                    (key, family_id, row["name"]),
                )
                id_map[key] = cur.fetchone()["id"]
            else:
                id_map[key] = f"dryrun-subfamily-{key}"
            continue

        id_map[key] = found["id"]
        if compute_change(found, incoming, ["family_id", "name"]):
            metrics.updated += 1
            if not dry_run:
                cur.execute(
                    "UPDATE subfamily SET family_id = %s, name = %s WHERE id = %s",
                    (family_id, row["name"], found["id"]),
                )
        else:
            metrics.unchanged += 1

    return metrics, id_map, unresolved_family


def _sync_product(
    cur: psycopg.Cursor,
    products: list[dict],
    brand_ids: dict[str, str],
    family_ids: dict[str, str],
    subfamily_ids: dict[str, str],
    dry_run: bool,
) -> tuple[EntityMetrics, dict[str, int]]:
    metrics = EntityMetrics(read=len(products))

    unresolved_brand = 0
    unresolved_family = 0
    unresolved_subfamily = 0

    keys = [p["erp_code"] for p in products]
    if not keys:
        return metrics, {
            "unresolved_brand_relations": 0,
            "unresolved_family_relations": 0,
            "unresolved_subfamily_relations": 0,
        }

    cur.execute(
        """
        SELECT id, erp_code, erp_name, brand_id, family_id, subfamily_id, imported_from_dw_at
        FROM product
        WHERE erp_code = ANY(%s)
        """,
        (keys,),
    )
    existing = {row["erp_code"]: row for row in cur.fetchall()}

    for row in products:
        brand_id = brand_ids.get(row["source_brand_id"]) if row["source_brand_id"] else None
        family_id = family_ids.get(row["source_family_id"]) if row["source_family_id"] else None
        subfamily_id = subfamily_ids.get(row["source_subfamily_id"]) if row["source_subfamily_id"] else None

        if row["source_brand_id"] and not brand_id:
            unresolved_brand += 1
        if row["source_family_id"] and not family_id:
            unresolved_family += 1
        if row["source_subfamily_id"] and not subfamily_id:
            unresolved_subfamily += 1

        incoming = {
            "erp_name": row["erp_name"],
            "brand_id": brand_id,
            "family_id": family_id,
            "subfamily_id": subfamily_id,
            "imported_from_dw_at": row["imported_from_dw_at"],
        }

        found = existing.get(row["erp_code"])
        if not found:
            metrics.inserted += 1
            if not dry_run:
                cur.execute(
                    """
                    INSERT INTO product (erp_code, erp_name, brand_id, family_id, subfamily_id, imported_from_dw_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        row["erp_code"],
                        incoming["erp_name"],
                        incoming["brand_id"],
                        incoming["family_id"],
                        incoming["subfamily_id"],
                        incoming["imported_from_dw_at"],
                    ),
                )
            continue

        has_changes = compute_change(found, incoming, ["erp_name", "brand_id", "family_id", "subfamily_id"])
        if has_changes:
            metrics.updated += 1
            if not dry_run:
                cur.execute(
                    """
                    UPDATE product
                    SET erp_name = %s,
                        brand_id = %s,
                        family_id = %s,
                        subfamily_id = %s,
                        imported_from_dw_at = %s
                    WHERE id = %s
                    """,
                    (
                        incoming["erp_name"],
                        incoming["brand_id"],
                        incoming["family_id"],
                        incoming["subfamily_id"],
                        incoming["imported_from_dw_at"],
                        found["id"],
                    ),
                )
        else:
            metrics.unchanged += 1

    return metrics, {
        "unresolved_brand_relations": unresolved_brand,
        "unresolved_family_relations": unresolved_family,
        "unresolved_subfamily_relations": unresolved_subfamily,
    }


def load_catalog_to_ecommerce(ecommerce_database_url: str, transformed: TransformResult, dry_run: bool) -> SyncResult:
    with psycopg.connect(ecommerce_database_url, row_factory=dict_row) as conn:
        try:
            with conn.cursor() as cur:
                brand_metrics, brand_ids = _sync_brand(cur, transformed.brands, dry_run)
                family_metrics, family_ids = _sync_family(cur, transformed.families, dry_run)
                subfamily_metrics, subfamily_ids, unresolved_subfamily_family = _sync_subfamily(
                    cur,
                    transformed.subfamilies,
                    family_ids,
                    dry_run,
                )
                product_metrics, product_diag = _sync_product(
                    cur,
                    transformed.products,
                    brand_ids,
                    family_ids,
                    subfamily_ids,
                    dry_run,
                )

            if dry_run:
                conn.rollback()
            else:
                conn.commit()
        except Exception:
            conn.rollback()
            raise

    diagnostics = {
        "discarded_rows": len(transformed.discarded_rows),
        "products_without_brand": transformed.profiling.get("products_without_brand", 0),
        "products_without_family": transformed.profiling.get("products_without_family", 0),
        "products_without_subfamily": transformed.profiling.get("products_without_subfamily", 0),
        "unresolved_subfamily_family_relations": unresolved_subfamily_family,
        "unresolved_brand_relations": product_diag["unresolved_brand_relations"],
        "unresolved_family_relations": product_diag["unresolved_family_relations"],
        "unresolved_subfamily_relations": product_diag["unresolved_subfamily_relations"],
    }

    return SyncResult(
        brand=brand_metrics,
        family=family_metrics,
        subfamily=subfamily_metrics,
        product=product_metrics,
        diagnostics=diagnostics,
    )
