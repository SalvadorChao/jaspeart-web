type QuantityControlProps = {
  value: number;
  min?: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  labelledBy?: string;
  label?: string;
};

export function QuantityControl({
  value,
  min = 1,
  max,
  disabled = false,
  onChange,
  labelledBy,
  label,
}: QuantityControlProps) {
  return (
    <div role="group" aria-labelledby={labelledBy} aria-label={label} className="flex border border-ink">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Reducir cantidad"
        className="size-10 text-lg disabled:text-ink-muted/50"
      >
        −
      </button>
      <output aria-live="polite" className="flex w-12 items-center justify-center border-x border-rule text-sm tabular-nums">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Aumentar cantidad"
        className="size-10 text-lg disabled:text-ink-muted/50"
      >
        +
      </button>
    </div>
  );
}
