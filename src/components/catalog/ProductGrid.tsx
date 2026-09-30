import type { CatalogProduct } from "@/lib/catalog/types";
import { ProductTile } from "./ProductTile";

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductTile product={product} />
        </li>
      ))}
    </ul>
  );
}
