import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-page px-gutter pb-section">
      <div className="pt-7">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Cesta", href: "/cesta" }, { label: "Checkout" }]} />
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight md:mt-10 md:text-5xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
