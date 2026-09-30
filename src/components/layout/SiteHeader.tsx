"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

const NAV = [
  { href: "/", label: "Inicio", isActive: (path: string) => path === "/" },
  {
    href: "/categoria/acuarela",
    label: "Comprar",
    isActive: (path: string) => path.startsWith("/categoria") || path.startsWith("/producto"),
  },
  { href: "/#materiales", label: "Materiales", isActive: () => false },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { hydrated, totalUnits } = useCart();
  const cartActive = pathname === "/cesta";

  return (
    <header className="border-b border-rule bg-paper">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 px-5 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link href="/" className="col-start-1 row-start-1 py-4 text-xl font-bold tracking-tight md:py-5">
          JaspeArt
        </Link>

        <nav
          aria-label="Principal"
          className="col-span-2 row-start-2 -mx-1 md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <ul className="flex gap-6 text-[13px]">
            {NAV.map((item) => {
              const active = item.isActive(pathname);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block border-b px-1 pb-3 pt-1 md:py-5 ${
                      active ? "border-ink" : "border-transparent hover:border-rule"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search is still visual-only. */}
        <div className="col-start-2 row-start-1 flex justify-end gap-4 text-[13px] md:col-start-3">
          <button type="button" aria-disabled="true" className="cursor-default">
            Buscar
          </button>
          <Link
            href="/cesta"
            aria-current={cartActive ? "page" : undefined}
            aria-label={
              hydrated ? `Cesta, ${totalUnits} ${totalUnits === 1 ? "unidad" : "unidades"}` : "Cesta"
            }
            className={`border-b ${cartActive ? "border-ink" : "border-transparent hover:border-rule"}`}
          >
            Cesta{hydrated && <span className="tabular-nums"> ({totalUnits})</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
