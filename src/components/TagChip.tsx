import { cn } from '@/lib/utils';

interface Props {
  name: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const COLORS = [
  '#a78bfa', '#60a5fa', '#34d399', '#fbbf24',
  '#f472b6', '#fb923c', '#2dd4bf', '#f87171',
];

export default function TagChip({ name, active, onClick, size = 'md' }: Props) {
  const color = COLORS[Math.abs(hashCode(name)) % COLORS.length];

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border transition-all whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        active
          ? 'text-white'
          : 'text-text-muted border-border hover:border-text-muted',
      )}
      style={active ? {
        background: `${color}20`,
        borderColor: `${color}60`,
        color: color,
      } : undefined}
    >
      {name}
    </button>
  );
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
