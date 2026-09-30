import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlpFilters } from "@/components/catalog/PlpFilters";
import { PlpToolbar } from "@/components/catalog/PlpToolbar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  getCategory,
  getFacets,
  listCategories,
  listProducts,
  parseFilters,
  parseSort,
  SORT_OPTIONS,
} from "@/lib/catalog/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const FORM_ID = "plp-filters";

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return category ? { title: category.name, description: category.intro } : {};
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const query = await searchParams;
  const filters = parseFilters(query);
  const sort = parseSort(query);
  const [products, facets] = await Promise.all([
    listProducts(category.slug, filters, sort),
    getFacets(category.slug, filters),
  ]);
  const action = `/categoria/${category.slug}`;

  return (
    <div className="mx-auto max-w-page px-gutter">
      <div className="pt-7">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: category.name }]} />
      </div>

      <header className="mt-8 flex flex-col gap-2 md:mt-10 md:flex-row md:items-end md:justify-between">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{category.name}</h1>
        <p className="text-sm text-ink-muted md:pb-1.5">{category.intro}</p>
      </header>

      <EditorialPlaceholder
        tone="water"
        description="lavado de acuarela azul verdoso sobre papel texturado"
        className="mt-6 aspect-[2/1] md:mt-7 md:aspect-[27/10]"
      />

      <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        <aside aria-label="Filtros">
          <PlpFilters formId={FORM_ID} action={action} facets={facets} filters={filters} sort={sort} />
        </aside>

        <section aria-label="Productos">
          <PlpToolbar formId={FORM_ID} count={products.length} sort={sort} options={SORT_OPTIONS} />
          <div className="pt-5">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="border-b border-rule py-16 text-center">
                <p className="text-sm">No hay productos que cumplan estos filtros.</p>
                <Link href={action} className="mt-3 inline-block text-sm underline underline-offset-4">
                  Limpiar filtros
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-section flex flex-col gap-3 border-t border-ink py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-xl md:text-2xl">¿Quieres que el agua haga el trabajo?</p>
        <Link href="/#materiales" className="text-sm hover:underline">
          Ver la selección de inicio →
        </Link>
      </div>
    </div>
  );
}
