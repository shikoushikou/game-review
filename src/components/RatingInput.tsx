'use client';

interface Props {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}

export default function RatingInput({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted w-12">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? null : n)}
            className={`w-7 h-7 rounded text-xs font-medium transition-all
              ${value && n <= value
                ? 'bg-accent text-white'
                : value && n === value
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border text-text-muted hover:border-text-muted'
              }`}
            style={value && n <= value ? undefined : undefined}
          >
            {n}
          </button>
        ))}
        {value != null && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="w-7 h-7 rounded text-xs text-text-muted hover:text-text"
          >
            ✕
          </button>
        )}
      </div>
      {value != null && (
        <span className="text-sm font-bold text-accent">{value}/10</span>
      )}
    </div>
  );
}
