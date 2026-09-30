import Link from "next/link";
import { Price } from "@/components/catalog/Price";
import type { CatalogProduct } from "@/lib/catalog/types";
import { QuantityStepper } from "./QuantityStepper";

function stockLabel(quantity: number): string {
  if (quantity <= 0) return "No disponible";
  return `En stock · ${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;
}

type ProductPurchaseProps = {
  product: CatalogProduct;
  variants: CatalogProduct[];
};

export function ProductPurchase({ product, variants }: ProductPurchaseProps) {
  const available = product.stockQuantity > 0;

  return (
    <div>
      <p className="text-xs text-ink-muted">
        {product.brand}
        {product.range && ` · ${product.range}`}
      </p>
      <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight md:text-[2.75rem]">
        {product.name}
      </h1>
      <p className="mt-3 text-[11px] text-ink-muted">Referencia {product.erpCode}</p>
      <Price value={product.price} className="mt-6 block text-2xl" />

      {variants.length > 1 && (
        <nav aria-label="Formato" className="mt-7">
          <p className="text-xs font-semibold">Formato</p>
          <ul className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2">
            {variants.map((variant) => {
              const current = variant.slug === product.slug;
              const variantAvailable = variant.stockQuantity > 0;
              return (
                <li key={variant.slug}>
                  <Link
                    href={`/producto/${variant.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={`block border px-3 py-2.5 ${
                      current
                        ? "border-ink border-b-2 border-b-accent"
                        : variantAvailable
                          ? "border-rule hover:border-ink"
                          : "border-rule bg-surface text-ink-muted hover:border-ink"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{variant.format}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-muted">
                      {variantAvailable ? "Disponible" : "No disponible"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <p className="mt-5 flex items-center gap-2 border-y border-rule py-4 text-xs font-semibold">
        <span aria-hidden="true" className={`size-2 rounded-full ${available ? "bg-accent" : "bg-ink-muted/50"}`} />
        {stockLabel(product.stockQuantity)}
      </p>

      <div className="mt-4">
        <QuantityStepper available={available} />
      </div>
    </div>
  );
}
