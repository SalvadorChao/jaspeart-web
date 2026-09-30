import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog/types";
import { Price } from "./Price";
import { ProductImage } from "./ProductImage";

export function ProductTile({ product }: { product: CatalogProduct }) {
  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <ProductImage
        image={product.images[0]}
        label={`${product.name} · ${product.format}`}
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 50vw"
      />
      <div className="px-0.5 pt-3">
        <h3 className="text-[13px] font-semibold leading-snug group-hover:underline">
          {product.name} {product.format}
        </h3>
        <p className="mt-1 text-xs text-ink-muted">{product.brand}</p>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-xs text-ink-muted">{product.colorName}</span>
          <Price value={product.price} className="text-[13px]" />
        </div>
      </div>
    </Link>
  );
}
