import Link from "next/link";
import { Price } from "@/components/catalog/Price";
import type { CatalogProduct } from "@/lib/catalog/types";

export function RelatedProducts({ products, categoryName }: { products: CatalogProduct[]; categoryName: string }) {
  if (!products.length) return null;

  return (
    <section aria-labelledby="related-title">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="related-title" className="text-xl font-bold tracking-tight md:text-2xl">
          También para trabajar con agua
        </h2>
        <p className="text-xs text-ink-muted">Selección de estudio</p>
      </div>
      <ul className="mt-4 grid border-l border-t border-rule sm:grid-cols-3">
        {products.map((product) => (
          <li key={product.slug} className="border-b border-r border-rule">
            <Link href={`/producto/${product.slug}`} className="group flex h-full flex-col p-5 hover:bg-surface">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                {categoryName} · {product.format}
              </span>
              <span className="mt-3 text-lg leading-snug group-hover:underline">{product.name}</span>
              <Price value={product.price} className="mt-auto pt-4 text-xs" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
