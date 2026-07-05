'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RatingInput from '@/components/RatingInput';

interface Tag { id: string; name: string; }

interface Props {
  allTags: Tag[];
  initial?: {
    id?: string;
    title?: string;
    titleEn?: string;
    coverUrl?: string;
    developer?: string;
    publisher?: string;
    releaseYear?: number;
    platforms?: string[];
    playStatus?: string;
    ratingPlot?: number | null;
    ratingGameplay?: number | null;
    ratingVisual?: number | null;
    ratingAudio?: number | null;
    ratingFeel?: number | null;
    ratingNarrative?: number | null;
    reviewText?: string;
    playHours?: number | null;
    startedDate?: string;
    completedDate?: string;
    tagNames?: string[];
  };
}

export default function GameForm({ allTags, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initial?.title || '');
  const [titleEn, setTitleEn] = useState(initial?.titleEn || '');
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl || '');
  const [developer, setDeveloper] = useState(initial?.developer || '');
  const [publisher, setPublisher] = useState(initial?.publisher || '');
  const [releaseYear, setReleaseYear] = useState(initial?.releaseYear?.toString() || '');
  const [platformsStr, setPlatformsStr] = useState(initial?.platforms?.join(', ') || '');
  const [playStatus, setPlayStatus] = useState(initial?.playStatus || 'completed');
  const [ratingPlot, setRatingPlot] = useState<number | null>(initial?.ratingPlot ?? null);
  const [ratingGameplay, setRatingGameplay] = useState<number | null>(initial?.ratingGameplay ?? null);
  const [ratingVisual, setRatingVisual] = useState<number | null>(initial?.ratingVisual ?? null);
  const [ratingAudio, setRatingAudio] = useState<number | null>(initial?.ratingAudio ?? null);
  const [ratingFeel, setRatingFeel] = useState<number | null>(initial?.ratingFeel ?? null);
  const [ratingNarrative, setRatingNarrative] = useState<number | null>(initial?.ratingNarrative ?? null);
  const [reviewText, setReviewText] = useState(initial?.reviewText || '');
  const [playHours, setPlayHours] = useState(initial?.playHours?.toString() || '');
  const [startedDate, setStartedDate] = useState(initial?.startedDate || '');
  const [completedDate, setCompletedDate] = useState(initial?.completedDate || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(initial?.tagNames || []);

  const toggleTag = (name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('游戏名称不能为空'); return; }
    setSaving(true);
    setError('');

    const body = {
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      coverUrl: coverUrl.trim() || undefined,
      developer: developer.trim() || undefined,
      publisher: publisher.trim() || undefined,
      releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
      platforms: platformsStr.split(',').map((s) => s.trim()).filter(Boolean),
      playStatus,
      ratingPlot: ratingPlot ?? undefined,
      ratingGameplay: ratingGameplay ?? undefined,
      ratingVisual: ratingVisual ?? undefined,
      ratingAudio: ratingAudio ?? undefined,
      ratingFeel: ratingFeel ?? undefined,
      ratingNarrative: ratingNarrative ?? undefined,
      reviewText: reviewText.trim() || undefined,
      playHours: playHours ? parseFloat(playHours) : undefined,
      startedDate: startedDate || undefined,
      completedDate: completedDate || undefined,
      tagNames: selectedTags,
    };

    const url = isEdit ? `/api/games/${initial!.id}` : '/api/games';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/games/${isEdit ? initial!.id : data.id}`);
    } else {
      const data = await res.json().catch(() => ({ error: '保存失败' }));
      setError(data.error || '保存失败');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-xl font-bold">{isEdit ? '编辑游戏' : '添加游戏'}</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 基本信息 */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">基本信息</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">游戏名称 *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">英文名</label>
            <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-text-muted mb-1">封面图 URL</label>
            <input type="text" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="粘贴图片链接..."
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
            {coverUrl && (
              <img src={coverUrl} alt="preview" className="mt-2 h-20 rounded border border-border object-cover" />
            )}
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">开发商</label>
            <input type="text" value={developer} onChange={(e) => setDeveloper(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">发行商</label>
            <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">发行年份</label>
            <input type="number" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">游玩状态</label>
            <select value={playStatus} onChange={(e) => setPlayStatus(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50">
              <option value="completed">已通关</option>
              <option value="platinum">已白金</option>
              <option value="playing">在玩</option>
              <option value="dropped">弃坑</option>
              <option value="endless">永久在玩</option>
              <option value="replayed">多次重温</option>
              <option value="backlog">待玩</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">平台（逗号分隔）</label>
            <input type="text" value={platformsStr} onChange={(e) => setPlatformsStr(e.target.value)}
              placeholder="PC, PS5, Switch"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
        </div>
      </div>

      {/* 评分 */}
      <div className="card p-6 space-y-3">
        <h2 className="font-semibold">评分（1-10，点击数字选择，再点取消）</h2>
        <RatingInput label="剧情" value={ratingPlot} onChange={setRatingPlot} />
        <RatingInput label="玩法" value={ratingGameplay} onChange={setRatingGameplay} />
        <RatingInput label="美术" value={ratingVisual} onChange={setRatingVisual} />
        <RatingInput label="音乐" value={ratingAudio} onChange={setRatingAudio} />
        <RatingInput label="手感" value={ratingFeel} onChange={setRatingFeel} />
        <RatingInput label="叙事" value={ratingNarrative} onChange={setRatingNarrative} />
      </div>

      {/* 游玩信息 */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">游玩信息</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">游玩时长（小时）</label>
            <input type="number" step="0.5" value={playHours} onChange={(e) => setPlayHours(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">开始日期</label>
            <input type="date" value={startedDate} onChange={(e) => setStartedDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">完成日期</label>
            <input type="date" value={completedDate} onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
        </div>
      </div>

      {/* 评测正文 */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">评测正文（支持 Markdown）</h2>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={12}
          placeholder="## 总体评价&#10;&#10;写下你的感受...&#10;&#10;## 优点&#10;&#10;- 优点1&#10;- 优点2&#10;&#10;## 缺点&#10;&#10;- 缺点1"
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent/50 font-mono resize-y"
        />
      </div>

      {/* 标签 */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">标签</h2>
        <div className="flex gap-2 flex-wrap">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag.name);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 rounded-full text-sm border transition-all
                  ${active
                    ? 'bg-accent/20 border-accent/50 text-accent'
                    : 'border-border text-text-muted hover:border-text-muted'
                  }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 提交 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? '保存中...' : isEdit ? '更新' : '添加'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-border text-text-muted rounded-lg px-6 py-3 hover:text-text transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
