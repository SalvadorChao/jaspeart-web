import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-gutter py-section">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-ink-muted">La página que buscas no existe o ya no está disponible.</p>
      <div className="mt-8 flex gap-6 text-sm">
        <Link href="/" className="border-b border-ink pb-0.5">
          Volver al inicio
        </Link>
        <Link href="/categoria/acuarela" className="border-b border-ink pb-0.5">
          Ver acuarela
        </Link>
      </div>
    </div>
  );
}
