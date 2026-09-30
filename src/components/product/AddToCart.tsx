"use client";

import Link from "next/link";
import { useState } from "react";
import { QuantityControl } from "@/components/cart/QuantityControl";
import { useCart } from "@/components/cart/CartProvider";
import type { CartProductSnapshot } from "@/lib/cart/cart";

export function AddToCart({ product }: { product: CartProductSnapshot }) {
  const { items, hydrated, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState<number | null>(null);

  const inCart = items.find((item) => item.slug === product.slug)?.quantity ?? 0;
  const remaining = Math.max(0, product.stockQuantity - inCart);
  const available = product.stockQuantity > 0;
  const canAdd = hydrated && remaining > 0;
  const shown = Math.min(quantity, Math.max(1, remaining));

  function handleAdd() {
    if (!canAdd) return;
    addItem(product, shown);
    setAdded(shown);
    setQuantity(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span id="quantity-label" className="text-xs font-semibold">
          Cantidad
        </span>
        <QuantityControl
          value={shown}
          max={Math.max(1, remaining)}
          disabled={!canAdd}
          onChange={(value) => {
            setQuantity(value);
            setAdded(null);
          }}
          labelledBy="quantity-label"
        />
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className={`w-full py-4 text-sm font-semibold ${
          canAdd ? "bg-ink text-paper hover:bg-ink/90" : "cursor-not-allowed bg-surface text-ink-muted"
        }`}
      >
        {!available ? "No disponible" : remaining === 0 && hydrated ? "Máximo disponible en la cesta" : "Añadir a la cesta"}
      </button>
      <p aria-live="polite" className="min-h-4 text-[11px] text-ink-muted">
        {added !== null && (
          <>
            Añadido a la cesta ({added} {added === 1 ? "unidad" : "unidades"}) ·{" "}
            <Link href="/cesta" className="text-ink underline underline-offset-4">
              Ver cesta
            </Link>
          </>
        )}
        {added === null && inCart > 0 && `Ya tienes ${inCart} en la cesta.`}
      </p>
    </div>
  );
}
