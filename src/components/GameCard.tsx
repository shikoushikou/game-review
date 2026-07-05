'use client';

import Link from 'next/link';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import TagChip from './TagChip';
import { computeOverallRating, cn } from '@/lib/utils';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    coverUrl: string | null;
    platforms: string[];
    playStatus: string;
    ratingPlot: number | null;
    ratingGameplay: number | null;
    ratingVisual: number | null;
    ratingAudio: number | null;
    ratingFeel: number | null;
    ratingNarrative: number | null;
    tags?: { id: string; name: string }[];
  };
}

export default function GameCard({ game }: GameCardProps) {
  const overall = computeOverallRating(game);
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/games/${game.id}`} className="card group block overflow-hidden">
      {/* 封面区域 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-hover">
        {game.coverUrl && !imgError ? (
          <>
            <img
              src={game.coverUrl}
              alt={game.title}
              className="w-full h-full object-cover transition-all duration-500
                         group-hover:scale-105 group-hover:brightness-110"
              onError={() => setImgError(true)}
            />
            {/* hover 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-zinc-800">
            🎮
          </div>
        )}
        {/* 评分浮层 */}
        {overall != null && (
          <div className="absolute top-2 right-2 bg-bg/80 backdrop-blur-sm rounded-lg px-2 py-1
                        border border-border">
            <span className="text-accent font-bold text-sm">{overall}</span>
            <span className="text-text-muted text-xs">/10</span>
          </div>
        )}
      </div>

      {/* 信息区域 */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{game.title}</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={game.playStatus} />
        </div>

        {/* 评分维度条 */}
        {overall != null && (
          <div className="flex gap-0.5">
            {(['ratingPlot','ratingGameplay','ratingVisual','ratingAudio','ratingFeel','ratingNarrative'] as const).map((key) => {
              const v = game[key];
              if (v == null) return null;
              return (
                <div
                  key={key}
                  className="flex-1 h-1 rounded-full"
                  style={{
                    background: v >= 8 ? '#34d399' : v >= 6 ? '#fbbf24' : '#f87171',
                    opacity: 0.6,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* 标签 */}
        {game.tags && game.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {game.tags.slice(0, 3).map((t) => (
              <TagChip key={t.id} name={t.name} size="sm" />
            ))}
            {game.tags.length > 3 && (
              <span className="text-xs text-text-muted">+{game.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
