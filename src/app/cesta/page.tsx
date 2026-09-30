import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = { title: "Cesta" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-page px-gutter pb-section">
      <div className="pt-7">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Cesta" }]} />
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight md:mt-10 md:text-5xl">Cesta</h1>
      <CartView />
    </div>
  );
}
