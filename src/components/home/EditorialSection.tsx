import type { ReactNode } from "react";

type EditorialSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  media: ReactNode;
  layout?: "wide-media" | "feature-media" | "narrow-media";
  tone?: "paper" | "tint";
  titleSize?: "lg" | "md";
  children?: ReactNode;
};

export function EditorialSection({
  id,
  eyebrow,
  title,
  lead,
  media,
  layout = "wide-media",
  tone = "paper",
  titleSize = "lg",
  children,
}: EditorialSectionProps) {
  const headingId = `${id ?? eyebrow.replace(/\W+/g, "-").toLowerCase()}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-4 ${tone === "tint" ? "bg-tint" : ""}`}
    >
      <div
        className={`mx-auto grid max-w-editorial items-center gap-10 px-gutter py-section md:gap-x-16 lg:gap-x-24 ${
          {
            "wide-media": "md:grid-cols-[3fr_2fr]",
            "feature-media": "md:grid-cols-[7fr_3fr]",
            "narrow-media": "md:grid-cols-[1fr_2fr]",
          }[layout]
        }`}
      >
        <div>{media}</div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/80">{eyebrow}</p>
          <h2
            id={headingId}
            className={`mt-3 font-bold tracking-tight ${
              titleSize === "lg" ? "text-4xl leading-[1.05] md:text-5xl" : "text-xl md:text-2xl"
            }`}
          >
            {title}
          </h2>
          {lead && <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">{lead}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
