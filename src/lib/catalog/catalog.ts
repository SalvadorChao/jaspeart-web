// Storefront catalog access. Currently backed by mock data; replace the internals to connect a real source.

import { mockCategories, mockProducts } from "./mock-data";
import type {
  ActiveFilters,
  CatalogCategory,
  CatalogProduct,
  FilterFacet,
  FilterKey,
  SortKey,
  SpecItem,
} from "./types";

type SearchParams = Record<string, string | string[] | undefined>;

const FACETS: { key: FilterKey; label: string; get: (p: CatalogProduct) => string | undefined }[] = [
  { key: "marca", label: "Marca", get: (p) => p.brand },
  { key: "formato", label: "Formato", get: (p) => p.format },
  { key: "color", label: "Familia de color", get: (p) => p.colorFamily },
  { key: "transparencia", label: "Transparencia", get: (p) => p.specs.transparency },
  { key: "granulacion", label: "Granulación", get: (p) => p.specs.granulation },
  { key: "permanencia", label: "Permanencia", get: (p) => p.specs.permanence },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre" },
];

export function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseFilters(params: SearchParams): ActiveFilters {
  const filters: ActiveFilters = {};
  for (const { key } of FACETS) {
    const raw = params[key];
    const values = (Array.isArray(raw) ? raw : raw ? [raw] : []).filter(Boolean);
    if (values.length) filters[key] = values;
  }
  return filters;
}

export function parseSort(params: SearchParams): SortKey {
  const raw = params.orden;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortKey) : "relevancia";
}

function matches(product: CatalogProduct, filters: ActiveFilters): boolean {
  return FACETS.every(({ key, get }) => {
    const selected = filters[key];
    if (!selected?.length) return true;
    const value = get(product);
    return value !== undefined && selected.includes(toSlug(value));
  });
}

function sortProducts(products: CatalogProduct[], sort: SortKey): CatalogProduct[] {
  const sorted = [...products];
  if (sort === "precio-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "precio-desc") sorted.sort((a, b) => b.price - a.price);
  if (sort === "nombre") sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return sorted;
}

export async function getCategory(slug: string): Promise<CatalogCategory | undefined> {
  return mockCategories.find((c) => c.slug === slug);
}

export async function listCategories(): Promise<CatalogCategory[]> {
  return mockCategories;
}

export async function listProducts(
  categorySlug: string,
  filters: ActiveFilters = {},
  sort: SortKey = "relevancia",
): Promise<CatalogProduct[]> {
  const inCategory = mockProducts.filter(
    (p) => p.categorySlug === categorySlug && matches(p, filters),
  );
  return sortProducts(inCategory, sort);
}

export async function getFacets(
  categorySlug: string,
  filters: ActiveFilters,
): Promise<FilterFacet[]> {
  const products = mockProducts.filter((p) => p.categorySlug === categorySlug);
  return FACETS.map(({ key, label, get }) => {
    const counts = new Map<string, number>();
    for (const p of products) {
      const value = get(p);
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const options = [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "es"))
      .map(([optionLabel, count]) => {
        const value = toSlug(optionLabel);
        return { value, label: optionLabel, count, checked: !!filters[key]?.includes(value) };
      });
    return { key, label, options };
  });
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  return mockProducts.find((p) => p.slug === slug);
}

export async function listProductSlugs(): Promise<string[]> {
  return mockProducts.map((p) => p.slug);
}

export async function getProductsBySlugs(slugs: string[]): Promise<CatalogProduct[]> {
  return slugs
    .map((slug) => mockProducts.find((p) => p.slug === slug))
    .filter((p): p is CatalogProduct => p !== undefined);
}

export async function getFormatVariants(product: CatalogProduct): Promise<CatalogProduct[]> {
  if (!product.formatGroup) return [];
  return mockProducts.filter((p) => p.formatGroup === product.formatGroup);
}

export async function getRelatedProducts(
  product: CatalogProduct,
  limit = 3,
): Promise<CatalogProduct[]> {
  const candidates = mockProducts.filter(
    (p) =>
      p.categorySlug === product.categorySlug &&
      p.slug !== product.slug &&
      (!product.formatGroup || p.formatGroup !== product.formatGroup),
  );
  const sameFamily = candidates.filter((p) => p.colorFamily === product.colorFamily);
  const others = candidates.filter((p) => p.colorFamily !== product.colorFamily);
  const seenGroups = new Set<string>();
  const related: CatalogProduct[] = [];
  for (const p of [...sameFamily, ...others]) {
    const group = p.formatGroup ?? p.slug;
    if (seenGroups.has(group)) continue;
    seenGroups.add(group);
    related.push(p);
    if (related.length === limit) break;
  }
  return related;
}

export function getSpecItems(product: CatalogProduct): SpecItem[] {
  return [
    { label: "Pigmento", value: product.specs.pigment },
    { label: "Familia", value: product.colorFamily },
    { label: "Temperatura", value: product.specs.temperature },
    { label: "Transparencia", value: product.specs.transparency },
    { label: "Granulación", value: product.specs.granulation },
    { label: "Permanencia", value: product.specs.permanence },
    { label: "Formato", value: product.format },
  ];
}
