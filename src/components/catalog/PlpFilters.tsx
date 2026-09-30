import Link from "next/link";
import type { ActiveFilters, FilterFacet, SortKey } from "@/lib/catalog/types";

type PlpFiltersProps = {
  formId: string;
  action: string;
  facets: FilterFacet[];
  filters: ActiveFilters;
  sort: SortKey;
};

// Paper-coloured tick: invisible until the checked state fills the box with ink.
const CHECK_ICON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2 5 8.5l4.5-5' fill='none' stroke='%23f8f8f4' stroke-width='1.6'/%3E%3C/svg%3E\")";

function buildHref(action: string, filters: ActiveFilters, sort: SortKey): string {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(filters)) {
    for (const value of values ?? []) params.append(key, value);
  }
  if (sort !== "relevancia") params.set("orden", sort);
  const query = params.toString();
  return query ? `${action}?${query}` : action;
}

export function PlpFilters({ formId, action, facets, filters, sort }: PlpFiltersProps) {
  const active = facets.flatMap((facet) =>
    facet.options
      .filter((o) => o.checked)
      .map((o) => ({ facet, option: o })),
  );

  return (
    <div>
      {/* CSS-only disclosure for small screens; the panel is always visible from lg. */}
      <input id={`${formId}-toggle`} type="checkbox" className="peer sr-only lg:hidden" />
      <label
        htmlFor={`${formId}-toggle`}
        className="flex cursor-pointer items-center justify-between border-y border-ink py-3 text-[13px] font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-ink lg:hidden"
      >
        <span>
          Filtros{active.length > 0 && ` (${active.length})`}
        </span>
        <span aria-hidden="true">+</span>
      </label>

      {/* Remount on URL change so uncontrolled checkboxes reflect the new filters after client navigation. */}
      <form
        key={buildHref(action, filters, sort)}
        id={formId}
        method="get"
        action={action}
        aria-label="Filtros de producto"
        className="hidden peer-checked:block lg:block"
      >
        <p className="hidden border-t border-ink py-4 text-xs font-semibold lg:block">Filtrar</p>

        {facets.map((facet, index) => {
          const hasChecked = facet.options.some((o) => o.checked);
          return (
            <details
              key={facet.key}
              open={hasChecked || index < 2}
              className="group border-t border-rule first-of-type:border-t-0 lg:first-of-type:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-xs font-semibold [&::-webkit-details-marker]:hidden">
                {facet.label}
                <span aria-hidden="true" className="font-normal text-ink-muted group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="hidden font-normal text-ink-muted group-open:inline">
                  −
                </span>
              </summary>
              <fieldset className="pb-4">
                <legend className="sr-only">{facet.label}</legend>
                <ul className="space-y-2.5">
                  {facet.options.map((option) => {
                    const id = `${formId}-${facet.key}-${option.value}`;
                    return (
                      <li key={option.value} className="flex items-center gap-2.5 text-[13px]">
                        <input
                          id={id}
                          type="checkbox"
                          name={facet.key}
                          value={option.value}
                          defaultChecked={option.checked}
                          style={{ backgroundImage: CHECK_ICON }}
                          className="size-3.5 shrink-0 cursor-pointer appearance-none border border-ink-muted/60 bg-paper bg-center bg-no-repeat checked:border-ink checked:bg-ink"
                        />
                        <label htmlFor={id} className="flex-1 cursor-pointer text-ink/80">
                          {option.label}
                        </label>
                        <span className="text-[11px] tabular-nums text-ink-muted">{option.count}</span>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </details>
          );
        })}

        <div className="flex items-center gap-4 border-t border-rule py-4">
          <button
            type="submit"
            className="flex-1 bg-ink px-4 py-2.5 text-xs font-semibold text-paper hover:bg-ink/90"
          >
            Aplicar
          </button>
          <Link href={action} className="text-xs text-ink-muted underline underline-offset-4 hover:text-ink">
            Limpiar
          </Link>
        </div>

        {active.length > 0 && (
          <ul aria-label="Filtros activos" className="space-y-2 border-t border-rule py-4">
            {active.map(({ facet, option }) => {
              const remaining = {
                ...filters,
                [facet.key]: filters[facet.key]?.filter((v) => v !== option.value),
              };
              return (
                <li key={`${facet.key}-${option.value}`} className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-semibold">
                    {facet.label}: {option.label}
                  </span>
                  <Link
                    href={buildHref(action, remaining, sort)}
                    className="text-ink-muted underline underline-offset-4 hover:text-ink"
                    aria-label={`Quitar filtro ${facet.label}: ${option.label}`}
                  >
                    Quitar
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </form>
    </div>
  );
}
