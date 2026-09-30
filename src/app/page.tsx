import Link from "next/link";
import { Price } from "@/components/catalog/Price";
import { CategoryEntry } from "@/components/home/CategoryEntry";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import { EditorialSection } from "@/components/home/EditorialSection";
import { HomeHero } from "@/components/home/HomeHero";
import { getProductsBySlugs, listCategories } from "@/lib/catalog/catalog";

export default async function HomePage() {
  const [waterSelection, earthSelection, categories] = await Promise.all([
    getProductsBySlugs([
      "ultramar-profundo-godet-entero",
      "verde-oxido-de-cromo-tubo-5-ml",
      "azul-ftalo-tubo-5-ml",
    ]),
    getProductsBySlugs([
      "ocre-amarillo-godet-entero",
      "siena-tostada-godet-entero",
      "sombra-tostada-tubo-15-ml",
    ]),
    listCategories(),
  ]);

  return (
    <>
      <HomeHero />

      <EditorialSection
        id="materiales"
        eyebrow="01 / Activación"
        title="Trabajar con agua"
        lead="La humedad despierta el color. El papel recibe, la fibra conduce y el pincel decide cuánto queda."
        media={<EditorialPlaceholder tone="water" description="gota de agua sobre pigmento azul verdoso" ratio="3 / 2" />}
      >
        <ul className="border-t border-ink">
          {waterSelection.map((product) => (
            <li key={product.slug} className="border-b border-rule">
              <Link href={`/producto/${product.slug}`} className="group flex items-start justify-between gap-4 py-4">
                <span>
                  <span className="block text-[13px] font-semibold group-hover:underline">{product.name}</span>
                  <span className="mt-1 block text-xs text-ink-muted">
                    {product.brand} · {product.format}
                  </span>
                </span>
                <Price value={product.price} className="text-[13px]" />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/categoria/acuarela"
          className="mt-6 inline-block border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-paper"
        >
          Ver selección
        </Link>
      </EditorialSection>

      <EditorialSection
        tone="tint"
        layout="feature-media"
        eyebrow="Loop 00:12"
        title="Viento / grafito"
        lead="El aire desplaza el polvo. El gesto decide."
        media={<EditorialPlaceholder tone="graphite" description="polvo de grafito desplazado sobre papel" ratio="16 / 9" />}
      />

      <EditorialSection
        layout="narrow-media"
        titleSize="md"
        eyebrow="02 / Origen"
        title="Tierras de origen mineral"
        lead="Color molido, materia visible y una escala terrestre para mezclar sin perder el rastro de su procedencia."
        media={<EditorialPlaceholder tone="earth" description="pigmentos tierra en polvo sobre papel" ratio="3 / 4" />}
      >
        <ul className="border-t border-ink">
          {earthSelection.map((product) => (
            <li key={product.slug} className="border-b border-rule">
              <Link href={`/producto/${product.slug}`} className="group flex items-center gap-3 py-3 text-[13px]">
                <span aria-hidden="true" className="size-3.5 shrink-0" style={{ backgroundColor: product.swatch }} />
                <span className="flex-1 group-hover:underline">
                  {product.name} <span className="text-[11px] text-ink-muted">{product.format}</span>
                </span>
                <Price value={product.price} className="text-xs" />
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <CategoryEntry categories={categories} />
    </>
  );
}
