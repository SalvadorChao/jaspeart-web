"use client";

import type { SortKey } from "@/lib/catalog/types";

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%2313211e' stroke-width='1.4'/%3E%3C/svg%3E\")";

type PlpToolbarProps = {
  formId: string;
  count: number;
  sort: SortKey;
  options: { value: SortKey; label: string }[];
};

export function PlpToolbar({ formId, count, sort, options }: PlpToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
      <p className="text-xs font-semibold" aria-live="polite">
        {count} {count === 1 ? "producto" : "productos"}
      </p>
      <div className="flex items-center gap-3 text-xs">
        <label htmlFor={`${formId}-orden`} className="text-ink-muted">
          Ordenar por
        </label>
        {/* Linked to the filter form so sort and filters travel together in the URL. */}
        <select
          key={sort}
          id={`${formId}-orden`}
          name="orden"
          form={formId}
          defaultValue={sort}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          style={{ backgroundImage: CHEVRON }}
          className="min-w-36 cursor-pointer appearance-none rounded-none border-b border-ink bg-transparent bg-[length:10px_6px] bg-[right_4px_center] bg-no-repeat py-1.5 pl-1 pr-6"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
