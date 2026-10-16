
interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  randomise?: () => void;
}

export default function Stepper({ label, value, min, max, step = 1, onChange, formatValue = String, randomise,}: Readonly<StepperProps>) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border text-xl font-bold transition hover:border-accent disabled:opacity-40">
        −
      </button>

      <div
        className="w-full rounded-xl border border-border px-4 py-3 text-center text-xl font-bold"
        aria-label={label}
        aria-live="polite">
        {formatValue(value)}
      </div>

      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border text-xl font-bold transition hover:border-accent disabled:opacity-40">
        +
      </button>


    </div>
  );
}
