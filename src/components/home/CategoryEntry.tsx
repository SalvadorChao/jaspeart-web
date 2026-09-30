import Link from "next/link";
import type { CatalogCategory } from "@/lib/catalog/types";

// Techniques without a category in the V1 catalogue are shown as plain text, not links.
const TECHNIQUES = ["Acuarela", "Óleo", "Acrílico", "Papel", "Pinceles"];

export function CategoryEntry({ categories }: { categories: CatalogCategory[] }) {
  return (
    <section aria-labelledby="category-entry-title">
      <div className="mx-auto max-w-editorial px-gutter py-section md:py-28">
        <h2
          id="category-entry-title"
          className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl"
        >
          Busca un material. Empieza por una técnica.
        </h2>

        {/* Search is visual-only in V1. */}
        <div role="search" className="mt-10 flex max-w-3xl border border-ink">
          <label htmlFor="home-search" className="sr-only">
            Buscar
          </label>
          <input
            id="home-search"
            type="search"
            placeholder="Busca marca, gama o referencia"
            disabled
            className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm placeholder:text-ink-muted"
          />
          <button type="button" aria-disabled="true" className="cursor-default bg-ink px-5 text-sm text-paper">
            Buscar
          </button>
        </div>

        <ul aria-label="Técnicas" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {TECHNIQUES.map((technique) => {
            const category = categories.find((c) => c.name === technique);
            return (
              <li key={technique}>
                {category ? (
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="border-b border-ink pb-0.5 hover:border-accent"
                  >
                    {technique}
                  </Link>
                ) : (
                  <span className="text-ink-muted">{technique}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
