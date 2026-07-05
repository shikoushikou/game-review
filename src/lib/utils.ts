import { type PlayStatus, PLAY_STATUS_LABELS } from '@/db/schema';

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatHours(h: number | null | undefined): string {
  if (h == null) return '';
  if (h < 1) return `${Math.round(h * 60)} 分钟`;
  return `${h} 小时`;
}

export function statusLabel(status: PlayStatus | string): string {
  return PLAY_STATUS_LABELS[status as PlayStatus] || status;
}

export function statusColor(status: PlayStatus | string): string {
  const colors: Record<string, string> = {
    completed: '#22c55e',
    platinum: '#a78bfa',
    dropped: '#ef4444',
    playing: '#eab308',
    endless: '#2dd4bf',
    replayed: '#f97316',
    backlog: '#6b7280',
  };
  return colors[status] || '#6b7280';
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function computeOverallRating(game: {
  ratingPlot?: number | null;
  ratingGameplay?: number | null;
  ratingVisual?: number | null;
  ratingAudio?: number | null;
  ratingFeel?: number | null;
  ratingNarrative?: number | null;
}): number | null {
  const ratings = [
    game.ratingPlot,
    game.ratingGameplay,
    game.ratingVisual,
    game.ratingAudio,
    game.ratingFeel,
    game.ratingNarrative,
  ].filter((r): r is number => r != null);
  if (ratings.length === 0) return null;
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return Math.round(avg * 10) / 10;
}
