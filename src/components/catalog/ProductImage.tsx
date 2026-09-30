import Image from "next/image";
import type { CatalogImage } from "@/lib/catalog/types";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";

type ProductImageProps = {
  image?: CatalogImage;
  label: string;
  ratio?: string;
  sizes: string;
  priority?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function ProductImage({
  image,
  label,
  ratio = "4 / 5",
  sizes,
  priority,
  size,
  className = "",
}: ProductImageProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-surface ${className}`} style={{ aspectRatio: ratio }}>
      {image ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <ProductImagePlaceholder label={label} size={size} />
      )}
    </div>
  );
}
