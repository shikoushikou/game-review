import { getGameById } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import StatusBadge from '@/components/StatusBadge';
import TagChip from '@/components/TagChip';
import RadarChart from '@/components/RadarChart';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ShareButton';
import { formatDate, formatHours, computeOverallRating } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameById(id);
  if (!game) return { title: '未找到' };

  const overall = computeOverallRating(game);
  const desc = overall ? `评分 ${overall}/10` : '个人游戏评测';

  return {
    title: `${game.title} - 评测`,
    description: desc,
    openGraph: {
      title: `🎮 ${game.title}`,
      description: desc,
      type: 'article',
      images: game.coverUrl ? [{ url: game.coverUrl }] : [],
    },
  };
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const game = await getGameById(id);
  if (!game) notFound();

  const overall = computeOverallRating(game);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 头部 */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* 封面 */}
        <div className="w-full sm:w-64 flex-shrink-0">
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={game.title}
              className="w-full rounded-xl border border-border"
            />
          ) : (
            <div className="w-full aspect-[16/10] rounded-xl bg-surface border border-border flex items-center justify-center text-5xl">
              🎮
            </div>
          )}
        </div>

        {/* 信息 */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{game.title}</h1>
            {game.titleEn && <p className="text-text-muted text-sm">{game.titleEn}</p>}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={game.playStatus} />
            {overall != null && (
              <span className="text-accent font-bold text-xl">{overall}</span>
            )}
            {overall != null && <span className="text-text-muted text-sm">/10</span>}
          </div>

          {/* 元数据 */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {game.developer && (
              <div><span className="text-text-muted">开发商：</span>{game.developer}</div>
            )}
            {game.publisher && (
              <div><span className="text-text-muted">发行商：</span>{game.publisher}</div>
            )}
            {game.releaseYear && (
              <div><span className="text-text-muted">发行年份：</span>{game.releaseYear}</div>
            )}
            {game.platforms.length > 0 && (
              <div><span className="text-text-muted">平台：</span>{game.platforms.join(' / ')}</div>
            )}
            {game.playHours != null && (
              <div><span className="text-text-muted">游玩时长：</span>{formatHours(game.playHours)}</div>
            )}
            {game.startedDate && (
              <div><span className="text-text-muted">开始日期：</span>{formatDate(game.startedDate)}</div>
            )}
            {game.completedDate && (
              <div><span className="text-text-muted">完成日期：</span>{formatDate(game.completedDate)}</div>
            )}
          </div>

          {/* 标签 */}
          {game.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {game.tags.map((t) => (
                <TagChip key={t.id} name={t.name} />
              ))}
            </div>
          )}

          {/* 分享 */}
          <ShareButton url={`/games/${game.id}`} title={game.title} />
        </div>
      </div>

      {/* 雷达图 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">评分维度</h2>
        <RadarChart data={game} />
      </div>

      {/* 评测正文 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">详细评测</h2>
        <MarkdownRenderer content={game.reviewText} />
      </div>
    </div>
  );
}
