"use client";

import Link from "next/link";
import { ProductImage } from "@/components/catalog/ProductImage";
import { formatPrice } from "@/components/catalog/Price";
import { QuantityControl } from "./QuantityControl";
import { useCart } from "./CartProvider";

export function CartLoading() {
  return <p className="mt-10 text-sm text-ink-muted">Cargando cesta…</p>;
}

export function CartEmpty() {
  return (
    <div className="mt-10 border-t border-rule pt-8">
      <p className="text-base">Tu cesta está vacía.</p>
      <Link href="/categoria/acuarela" className="mt-6 inline-block border-b border-ink pb-0.5 text-sm">
        Seguir comprando
      </Link>
    </div>
  );
}

export function CartView() {
  const { items, hydrated, totalUnits, subtotal, updateQuantity, removeItem } = useCart();

  if (!hydrated) return <CartLoading />;
  if (items.length === 0) return <CartEmpty />;

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-x-10 lg:gap-x-[5.5rem]">
      <ul aria-label="Productos en la cesta" className="border-b border-rule">
        {items.map((item) => {
          const labelId = `cart-qty-${item.slug}`;
          return (
            <li
              key={item.slug}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-t border-rule py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-x-6"
            >
              <Link href={`/producto/${item.slug}`} tabIndex={-1} aria-hidden="true" className="row-span-2 sm:row-span-1">
                <ProductImage label={`${item.name} · ${item.format}`} sizes="88px" size="sm" />
              </Link>
              <div className="min-w-0">
                <Link href={`/producto/${item.slug}`} className="text-sm font-semibold hover:underline">
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-ink-muted">{item.format}</p>
                <p className="mt-1 text-[11px] text-ink-muted">Referencia {item.erpCode}</p>
                <p className="mt-3 text-xs tabular-nums">{formatPrice(item.unitPrice)} / unidad</p>
              </div>
              <div className="col-start-2 flex flex-wrap items-center justify-between gap-4 sm:col-start-3 sm:flex-col sm:items-end sm:justify-start">
                <span id={labelId} className="sr-only">
                  Cantidad de {item.name} · {item.format}
                </span>
                <QuantityControl
                  value={item.quantity}
                  max={item.stockQuantity}
                  onChange={(value) => updateQuantity(item.slug, value)}
                  labelledBy={labelId}
                />
                <p className="text-sm font-semibold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Eliminar ${item.name} · ${item.format}`}
                  className="text-xs text-ink-muted underline underline-offset-4 hover:text-ink"
                >
                  Eliminar
                </button>
              </div>
              {item.quantity >= item.stockQuantity && (
                <p className="col-start-2 text-[11px] text-ink-muted sm:col-span-2">
                  Máximo disponible: {item.stockQuantity} {item.stockQuantity === 1 ? "unidad" : "unidades"}.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="cart-summary-title" className="self-start border-t border-ink pt-5">
        <h2 id="cart-summary-title" className="text-xs font-semibold">
          Resumen
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Unidades</dt>
            <dd className="tabular-nums">{totalUnits}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-rule pt-3">
            <dt className="font-semibold">Subtotal</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[11px] text-ink-muted">Envío no incluido en esta demo.</p>
        <Link
          href="/checkout"
          className="mt-6 block w-full bg-ink py-4 text-center text-sm font-semibold text-paper hover:bg-ink/90"
        >
          Continuar con la compra
        </Link>
      </section>
    </div>
  );
}
