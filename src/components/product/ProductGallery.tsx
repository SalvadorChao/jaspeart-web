"use client";

import { useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";
import type { CatalogImage } from "@/lib/catalog/types";

// Slots reserved for the expected shots until real photography exists.
const PLACEHOLDER_VIEWS = ["Producto", "Muestra de color", "Textura"];

type ProductGalleryProps = {
  images: CatalogImage[];
  label: string;
};

export function ProductGallery({ images, label }: ProductGalleryProps) {
  const slots = images.length
    ? images.map((image) => ({ image, view: image.alt }))
    : PLACEHOLDER_VIEWS.map((view) => ({ image: undefined, view }));
  const [selected, setSelected] = useState(0);
  const current = slots[selected];

  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-4">
      <div className="md:order-2">
        <ProductImage
          image={current.image}
          label={`${label} · ${current.view}`}
          sizes="(min-width: 768px) 45vw, 100vw"
          priority
          className="border border-surface"
        />
      </div>
      <ul aria-label="Vistas del producto" className="flex gap-2.5 md:order-1 md:flex-col">
        {slots.map((slot, index) => (
          <li key={slot.view} className="w-16 md:w-full">
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Ver ${slot.view}`}
              aria-pressed={index === selected}
              className={`block w-full border p-0.5 ${
                index === selected ? "border-ink" : "border-transparent hover:border-rule"
              }`}
            >
              <ProductImage image={slot.image} label={slot.view} ratio="1 / 1" size="sm" sizes="88px" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
