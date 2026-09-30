const formatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function formatPrice(value: number): string {
  return formatter.format(value);
}

export function Price({ value, className = "" }: { value: number; className?: string }) {
  return <span className={`font-semibold tabular-nums ${className}`}>{formatPrice(value)}</span>;
}
