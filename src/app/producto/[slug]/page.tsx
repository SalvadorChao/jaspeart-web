import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductDetailSections } from "@/components/product/ProductDetailSections";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductSpecList } from "@/components/product/ProductSpecList";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import {
  getCategory,
  getFormatVariants,
  getProductBySlug,
  getRelatedProducts,
  getSpecItems,
  listProductSlugs,
} from "@/lib/catalog/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? { title: `${product.name} · ${product.format}` } : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, variants, related] = await Promise.all([
    getCategory(product.categorySlug),
    getFormatVariants(product),
    getRelatedProducts(product),
  ]);
  const categoryName = category?.name ?? product.categorySlug;
  const specs = getSpecItems(product);

  return (
    <>
      <div className="mx-auto max-w-page px-gutter pb-section">
        <div className="pt-7">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: categoryName, href: `/categoria/${product.categorySlug}` },
              { label: product.name },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-x-10 lg:gap-x-[5.5rem]">
          <ProductGallery images={product.images} label={`${product.name} · ${product.format}`} />
          <div className="space-y-8">
            <ProductPurchase product={product} variants={variants} />
            <ProductSpecList items={specs} label="Características técnicas" />
          </div>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-page px-gutter py-12">
          <ProductDetailSections
            description={product.description}
            behavior={product.behavior}
            technical={[
              { label: "Referencia", value: product.erpCode },
              { label: "Marca", value: product.brand },
              { label: "Gama", value: product.range },
              ...specs,
            ]}
          />
        </div>
      </div>

      {product.materialNote && (
        <section aria-labelledby="material-title" className="border-t border-rule">
          <div className="mx-auto grid max-w-page gap-6 px-gutter py-12 md:grid-cols-[minmax(0,3.2fr)_minmax(0,1fr)] md:gap-x-8">
            <div>
              <h2 id="material-title" className="text-2xl font-bold tracking-tight md:text-[2rem]">
                Cuando toca el agua
              </h2>
              <EditorialPlaceholder
                tone={product.colorFamily === "Verdes" ? "green" : "water"}
                description={`${product.colorName} en contacto con el agua`}
                ratio="16 / 9"
                className="mt-4"
              />
            </div>
            <div className="md:pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Microfilm de producto propuesto · Loop
              </p>
              <p className="mt-3 text-[13px] leading-relaxed">{product.materialNote}</p>
              <p className="mt-3 text-[11px] text-ink-muted">Texto de muestra (mock).</p>
            </div>
          </div>
        </section>
      )}

      <div className="border-t border-rule">
        <div className="mx-auto max-w-page px-gutter py-12 md:py-16">
          <RelatedProducts products={related} categoryName={categoryName} />
        </div>
      </div>
    </>
  );
}
