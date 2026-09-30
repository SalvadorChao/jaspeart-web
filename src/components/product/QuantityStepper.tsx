"use client";

import { useState } from "react";

// Cart is not implemented in V1: the add button is intentionally inert.
export function QuantityStepper({ available }: { available: boolean }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span id="quantity-label" className="text-xs font-semibold">
          Cantidad
        </span>
        <div role="group" aria-labelledby="quantity-label" className="flex border border-ink">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={!available || quantity <= 1}
            aria-label="Reducir cantidad"
            className="size-10 text-lg disabled:text-ink-muted/50"
          >
            −
          </button>
          <output aria-live="polite" className="flex w-12 items-center justify-center border-x border-rule text-sm tabular-nums">
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={!available}
            aria-label="Aumentar cantidad"
            className="size-10 text-lg disabled:text-ink-muted/50"
          >
            +
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-disabled="true"
        aria-describedby="add-to-cart-note"
        className={`w-full py-4 text-sm font-semibold ${
          available ? "cursor-default bg-ink text-paper" : "cursor-not-allowed bg-surface text-ink-muted"
        }`}
      >
        {available ? "Añadir a la cesta" : "No disponible"}
      </button>
      <p id="add-to-cart-note" className="text-[11px] text-ink-muted">
        V1 demo: la cesta todavía no está activa.
      </p>
    </div>
  );
}
