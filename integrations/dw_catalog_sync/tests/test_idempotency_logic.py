from dw_catalog_sync.load import compute_change


def test_second_identical_run_has_no_change_for_product_fields():
    existing = {
        "erp_name": "Prod",
        "brand_id": "b1",
        "family_id": "f1",
        "subfamily_id": None,
    }
    incoming = {
        "erp_name": "Prod",
        "brand_id": "b1",
        "family_id": "f1",
        "subfamily_id": None,
    }

    changed = compute_change(existing, incoming, ["erp_name", "brand_id", "family_id", "subfamily_id"])
    assert changed is False


def test_changed_family_is_detected():
    existing = {
        "erp_name": "Prod",
        "brand_id": "b1",
        "family_id": "f1",
        "subfamily_id": None,
    }
    incoming = {
        "erp_name": "Prod",
        "brand_id": "b1",
        "family_id": "f2",
        "subfamily_id": None,
    }

    changed = compute_change(existing, incoming, ["erp_name", "brand_id", "family_id", "subfamily_id"])
    assert changed is True
