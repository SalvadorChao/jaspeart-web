"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { SpecItem } from "@/lib/catalog/types";
import { ProductSpecList } from "./ProductSpecList";

type ProductDetailSectionsProps = {
  description?: string;
  behavior?: string;
  technical: SpecItem[];
};

export function ProductDetailSections({ description, behavior, technical }: ProductDetailSectionsProps) {
  const baseId = useId();
  const tabs = [
    description && { key: "descripcion", label: "Descripción", text: description },
    behavior && { key: "comportamiento", label: "Comportamiento", text: behavior },
    { key: "ficha", label: "Ficha técnica" },
  ].filter((tab): tab is { key: string; label: string; text?: string } => Boolean(tab));

  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    const next = (active + delta + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = tabs[active];

  return (
    <div>
      <div role="tablist" aria-label="Información del producto" onKeyDown={onKeyDown} className="flex gap-8 border-b border-rule">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`${baseId}-tab-${tab.key}`}
            role="tab"
            type="button"
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={`-mb-px border-b py-3 text-xs ${
              index === active ? "border-ink font-semibold" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.key}`}
        tabIndex={0}
        className="max-w-2xl pt-6"
      >
        {current.text ? (
          <>
            <p className="text-base leading-relaxed">{current.text}</p>
            <p className="mt-4 text-[11px] text-ink-muted">Texto de muestra (mock), no es información real del producto.</p>
          </>
        ) : (
          <ProductSpecList items={technical} label="Ficha técnica" />
        )}
      </div>
    </div>
  );
}
