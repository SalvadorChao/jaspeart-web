from datetime import datetime, timezone

from dw_catalog_sync.load import apply_product_dw_fields, compute_change
from dw_catalog_sync.extract import ExtractionResult, ProductSource
from dw_catalog_sync.transform import transform_catalog_data


def test_compute_change_detects_changes_only_in_owned_fields():
    existing = {"name": "A", "slug": "keep"}
    incoming = {"name": "B", "slug": "other"}
    assert compute_change(existing, incoming, ["name"]) is True
    assert compute_change(existing, incoming, ["slug"]) is True
    assert compute_change(existing, existing, ["name"]) is False


def test_product_update_preserves_ecommerce_fields():
    existing = {
        "erp_name": "Old",
        "brand_id": "b1",
        "family_id": "f1",
        "subfamily_id": None,
        "imported_from_dw_at": None,
        "commerce_name": "Custom name",
        "short_description": "Custom short",
        "price": 12.5,
        "stock_quantity": 4,
    }
    incoming = {
        "erp_name": "New",
        "brand_id": "b2",
        "family_id": "f2",
        "subfamily_id": None,
        "imported_from_dw_at": datetime.now(timezone.utc),
    }

    updated = apply_product_dw_fields(existing, incoming)

    assert updated["erp_name"] == "New"
    assert updated["brand_id"] == "b2"
    assert updated["family_id"] == "f2"
    assert updated["commerce_name"] == "Custom name"
    assert updated["short_description"] == "Custom short"
    assert updated["price"] == 12.5
    assert updated["stock_quantity"] == 4


def test_product_update_supports_nullable_subfamily():
    existing = {
        "erp_name": "Name",
        "brand_id": "b1",
        "family_id": "f1",
        "subfamily_id": "s1",
        "imported_from_dw_at": None,
    }
    incoming = {
        "erp_name": "Name",
        "brand_id": "b1",
        "family_id": "f1",
        "subfamily_id": None,
        "imported_from_dw_at": datetime.now(timezone.utc),
    }

    updated = apply_product_dw_fields(existing, incoming)
    assert updated["subfamily_id"] is None


def test_transform_discards_product_missing_erp_name():
    extracted = ExtractionResult(
        brands=[],
        families=[],
        subfamilies=[],
        products=[
            ProductSource(
                erp_code="P001",
                erp_name=None,
                source_brand_id=None,
                source_family_id=None,
                source_subfamily_id=None,
                imported_from_dw_at=datetime.now(timezone.utc),
            )
        ],
        profiling={},
        open_questions=[],
    )

    transformed = transform_catalog_data(extracted)
    assert transformed.products == []
    assert transformed.discarded_rows[0]["reason"] == "missing_erp_name"
