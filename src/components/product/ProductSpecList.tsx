import type { SpecItem } from "@/lib/catalog/types";

export function ProductSpecList({ items, label }: { items: SpecItem[]; label: string }) {
  const rows = items.filter((item) => item.value);
  if (!rows.length) return null;

  return (
    <dl aria-label={label} className="border-t border-rule">
      {rows.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-6 border-b border-rule py-2.5">
          <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted">{item.label}</dt>
          <dd className="text-right text-[13px]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
