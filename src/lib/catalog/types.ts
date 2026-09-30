// View-model types for the storefront; intentionally independent of the Prisma client.

export type CatalogImage = {
  src: string;
  alt: string;
};

export type CatalogCategory = {
  slug: string;
  name: string;
  intro: string;
};

export type CatalogProduct = {
  slug: string;
  erpCode: string;
  name: string;
  categorySlug: string;
  brand: string;
  range?: string;
  // Products sharing a formatGroup are the same colour in different formats.
  formatGroup?: string;
  format: string;
  colorName: string;
  colorFamily: string;
  swatch?: string;
  price: number;
  stockQuantity: number;
  specs: {
    pigment?: string;
    temperature?: string;
    transparency?: string;
    granulation?: string;
    permanence?: string;
  };
  description?: string;
  behavior?: string;
  materialNote?: string;
  images: CatalogImage[];
};

export type SpecItem = {
  label: string;
  value?: string;
};

export type FilterKey =
  | "marca"
  | "formato"
  | "color"
  | "transparencia"
  | "granulacion"
  | "permanencia";

export type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

export type ActiveFilters = Partial<Record<FilterKey, string[]>>;

export type FilterOption = {
  value: string;
  label: string;
  count: number;
  checked: boolean;
};

export type FilterFacet = {
  key: FilterKey;
  label: string;
  options: FilterOption[];
};
