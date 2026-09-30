type ProductImagePlaceholderProps = {
  label?: string;
  size?: "sm" | "md";
};

// Fills its positioned parent so the layout matches the future photograph exactly.
export function ProductImagePlaceholder({ label, size = "md" }: ProductImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label ? `Foto test: ${label}` : "Foto test"}
      className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface p-2 text-center"
    >
      <span
        className={`font-medium uppercase tracking-[0.18em] text-ink-muted ${
          size === "sm" ? "text-[9px]" : "text-[11px]"
        }`}
      >
        Foto test
      </span>
      {label && size === "md" && (
        <span className="max-w-[80%] text-[11px] leading-snug text-ink-muted/80">{label}</span>
      )}
    </div>
  );
}
