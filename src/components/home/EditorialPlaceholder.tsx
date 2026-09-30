const TONES = {
  forest:
    "radial-gradient(ellipse at 70% 30%, #3e5a52 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, #1d3330 0%, transparent 60%), linear-gradient(160deg, #22332f 0%, #142420 100%)",
  water:
    "radial-gradient(ellipse 45% 38% at 60% 55%, #2f7f8e 0%, #73b5bf 45%, transparent 75%), radial-gradient(ellipse 30% 25% at 38% 48%, #5aa79e 0%, transparent 70%), linear-gradient(#eeefec, #e6e8e4)",
  graphite:
    "radial-gradient(ellipse 50% 30% at 45% 55%, #3a3d3d 0%, #8a8e8d 50%, transparent 80%), linear-gradient(#dcdedc, #cfd2d0)",
  earth:
    "radial-gradient(circle at 35% 30%, #a8664a 0%, transparent 30%), radial-gradient(circle at 65% 45%, #7a3f2a 0%, transparent 25%), radial-gradient(circle at 40% 72%, #c79a45 0%, transparent 25%), linear-gradient(#ece9e2, #e2ddd3)",
  green:
    "radial-gradient(ellipse 50% 40% at 40% 60%, #2f6b3c 0%, #6aa46f 45%, transparent 80%), linear-gradient(#ebedea, #e1e4e0)",
} as const;

export type EditorialTone = keyof typeof TONES;

type EditorialPlaceholderProps = {
  tone: EditorialTone;
  description: string;
  className?: string;
  ratio?: string;
};

// Stand-in for future editorial photography or video; keeps the final composition's proportions.
export function EditorialPlaceholder({ tone, description, className = "", ratio }: EditorialPlaceholderProps) {
  const dark = tone === "forest";
  return (
    <div
      role="img"
      aria-label={`Imagen editorial test: ${description}`}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: TONES[tone], aspectRatio: ratio }}
    >
      <span
        className={`absolute right-3 top-3 text-[10px] font-medium uppercase tracking-[0.18em] ${
          dark ? "text-paper/60" : "text-ink/50"
        }`}
      >
        Imagen editorial test
      </span>
    </div>
  );
}
