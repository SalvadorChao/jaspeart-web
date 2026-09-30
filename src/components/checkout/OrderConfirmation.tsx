"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/components/catalog/Price";
import { parseDemoOrder, readDemoOrderRaw } from "@/lib/checkout/demo-order";

const subscribe = () => () => {};

const continueLink = (
  <Link href="/categoria/acuarela" className="mt-8 inline-block border-b border-ink pb-0.5 text-sm">
    Seguir comprando
  </Link>
);

export function OrderConfirmation() {
  const { hydrated, clearCart } = useCart();
  // null on the server and during hydration; "" when the tab has no demo order.
  const raw = useSyncExternalStore(subscribe, readDemoOrderRaw, () => null);
  const order = useMemo(() => (raw ? parseDemoOrder(raw) : null), [raw]);

  // Wait for cart hydration, otherwise the stored cart would be restored after clearing.
  useEffect(() => {
    if (hydrated && order) clearCart();
  }, [hydrated, order, clearCart]);

  if (raw === null) return <p className="mt-10 text-sm text-ink-muted">Cargando pedido…</p>;

  if (!order) {
    return (
      <div className="mt-10 border-t border-rule pt-8">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">No hay ningún pedido reciente</h1>
        {continueLink}
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Pedido de prueba</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Pedido recibido</h1>
      <p className="mt-4 max-w-md text-ink-muted">
        Gracias, {order.customer.firstName}. Esto es una demo: no se ha realizado ningún cobro ni se enviará nada.
      </p>

      <section aria-labelledby="order-summary-title" className="mt-10 max-w-xl border-t border-ink pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="order-summary-title" className="text-xs font-semibold">
            Resumen
          </h2>
          <p className="text-xs">
            Número de pedido <span className="font-semibold tabular-nums">{order.orderNumber}</span>
          </p>
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          {order.items.map((item) => (
            <li key={item.slug} className="flex justify-between gap-4">
              <span className="min-w-0">
                <span className="block font-semibold">{item.name}</span>
                <span className="block text-xs text-ink-muted">
                  {item.format} · {item.quantity} × {formatPrice(item.unitPrice)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between gap-4 border-t border-rule pt-3 text-sm font-semibold">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
        </div>
      </section>

      {continueLink}
    </div>
  );
}
