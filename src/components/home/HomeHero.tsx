import Link from "next/link";
import { EditorialPlaceholder } from "./EditorialPlaceholder";

const CHAPTERS = ["Bosque húmedo", "Macro de gota", "Pigmento seco", "Capilaridad"];

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative h-[min(88svh,52rem)] min-h-[32rem] text-paper">
      <div className="absolute inset-0">
        <EditorialPlaceholder
          tone="forest"
          description="bosque húmedo, lluvia sobre hojas"
          className="h-full"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-10 px-5 pb-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
            Microfilm propuesto · Loop sin sonido
          </p>
          <h1 id="home-hero-title" className="mt-4 text-5xl font-bold leading-none tracking-tight md:text-[4rem]">
            Agua y pigmento
          </h1>
          <p className="mt-4 text-[13px] text-paper/85">Loop 00:18 · lluvia → gota → papel</p>
          <Link
            href="/categoria/acuarela"
            className="mt-7 inline-block bg-paper px-5 py-2.5 text-sm text-ink hover:bg-paper/90"
          >
            Explorar acuarela
          </Link>
        </div>
        <ol aria-label="Secuencia del microfilm" className="hidden w-56 text-xs md:block">
          {CHAPTERS.map((chapter, index) => (
            <li
              key={chapter}
              className={`border-t border-paper/30 py-2.5 last:border-b ${
                index === 2 ? "border-l-2 border-l-accent pl-2 font-semibold" : "text-paper/80"
              }`}
            >
              {chapter}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
