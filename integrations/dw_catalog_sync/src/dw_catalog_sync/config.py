from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    dw_database_url: str
    ecommerce_database_url: str
    log_level: str = "INFO"


def load_settings() -> Settings:
    dw_url = os.getenv("DW_DATABASE_URL")
    ecommerce_url = os.getenv("ECOMMERCE_DATABASE_URL")

    missing = []
    if not dw_url:
        missing.append("DW_DATABASE_URL")
    if not ecommerce_url:
        missing.append("ECOMMERCE_DATABASE_URL")

    if missing:
        missing_csv = ", ".join(missing)
        raise ValueError(f"Missing required environment variables: {missing_csv}")

    log_level = os.getenv("DW_CATALOG_SYNC_LOG_LEVEL", "INFO").upper()
    return Settings(
        dw_database_url=dw_url,
        ecommerce_database_url=ecommerce_url,
        log_level=log_level,
    )
