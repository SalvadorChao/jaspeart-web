"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { CartEmpty, CartLoading } from "@/components/cart/CartView";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/components/catalog/Price";
import { createDemoOrder, saveDemoOrder, type DemoCustomer } from "@/lib/checkout/demo-order";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: keyof DemoCustomer;
  label: string;
  className?: string;
};

function Field({ name, label, required, className = "", ...input }: FieldProps) {
  const id = `checkout-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-semibold">
        {label}
        {!required && <span className="font-normal text-ink-muted"> (opcional)</span>}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        className="mt-2 w-full rounded-none border border-rule bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink user-invalid:border-ink user-invalid:border-b-2"
        {...input}
      />
    </div>
  );
}

function readCustomer(form: HTMLFormElement): DemoCustomer {
  const data = new FormData(form);
  const value = (key: keyof DemoCustomer) => String(data.get(key) ?? "").trim();
  return {
    firstName: value("firstName"),
    lastName: value("lastName"),
    email: value("email"),
    phone: value("phone") || undefined,
    address: value("address"),
    postalCode: value("postalCode"),
    city: value("city"),
    province: value("province"),
  };
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, hydrated, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) return <CartLoading />;
  if (items.length === 0 && !submitting) return <CartEmpty />;

  // Runs only after native constraint validation has passed.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      saveDemoOrder(createDemoOrder(items, readCustomer(event.currentTarget)));
    } catch {
      setError("No se ha podido registrar el pedido de prueba. Inténtalo de nuevo.");
      return;
    }
    setSubmitting(true);
    router.push("/pedido/confirmado");
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Datos del pedido"
      className="mt-8 grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-x-10 lg:gap-x-[5.5rem]"
    >
      <div className="space-y-10">
        <fieldset className="border-t border-ink pt-5">
          <legend className="float-left w-full text-xs font-semibold">Contacto</legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            <Field name="firstName" label="Nombre" required autoComplete="given-name" />
            <Field name="lastName" label="Apellidos" required autoComplete="family-name" />
            <Field name="email" label="Email" type="email" required autoComplete="email" />
            <Field name="phone" label="Teléfono" type="tel" autoComplete="tel" />
          </div>
        </fieldset>

        <fieldset className="border-t border-ink pt-5">
          <legend className="float-left w-full text-xs font-semibold">Dirección</legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            <Field
              name="address"
              label="Dirección"
              required
              autoComplete="street-address"
              className="sm:col-span-2"
            />
            <Field
              name="postalCode"
              label="Código postal"
              required
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              title="Código postal de 5 dígitos"
              autoComplete="postal-code"
            />
            <Field name="city" label="Ciudad" required autoComplete="address-level2" />
            <Field name="province" label="Provincia" required autoComplete="address-level1" />
            <div>
              <p className="text-xs font-semibold">País</p>
              <p className="mt-2 border border-rule bg-surface px-3 py-2.5 text-sm text-ink-muted">España</p>
            </div>
          </div>
        </fieldset>
      </div>

      <section aria-labelledby="checkout-summary-title" className="self-start border-t border-ink pt-5">
        <h2 id="checkout-summary-title" className="text-xs font-semibold">
          Tu pedido
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
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
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-3 text-[11px] text-ink-muted">Envío no incluido en esta demo.</p>
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-ink py-4 text-sm font-semibold text-paper hover:bg-ink/90 disabled:bg-surface disabled:text-ink-muted"
        >
          Realizar pedido de prueba
        </button>
        <p className="mt-3 text-[11px] text-ink-muted">Pedido de prueba: no se realiza ningún cobro ni envío.</p>
        {error && (
          <p role="alert" className="mt-3 text-xs font-semibold">
            {error}
          </p>
        )}
      </section>
    </form>
  );
}
