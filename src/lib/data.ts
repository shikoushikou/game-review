import { readStore, saveStore, type GameItem, type TagItem } from './store';
import { v4 as uuid } from 'uuid';

// ---- 类型（兼容旧组件接口） ----

export type GameWithTags = GameItem & { tags: { id: string; name: string; slug: string }[] };
export type Tag = TagItem;

// ---- 查询 ----

export async function getAllTags(): Promise<TagItem[]> {
  const store = await readStore();
  return store.tags;
}

export async function getGames(opts: {
  search?: string;
  status?: string;
  tagSlugs?: string[];
  sort?: string;
}): Promise<GameWithTags[]> {
  const store = await readStore();
  let result = [...store.games];

  // 搜索
  if (opts.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(g => g.title.toLowerCase().includes(q));
  }

  // 状态筛选
  if (opts.status) {
    result = result.filter(g => g.playStatus === opts.status);
  }

  // 标签筛选 (AND)
  if (opts.tagSlugs && opts.tagSlugs.length > 0) {
    for (const slug of opts.tagSlugs) {
      const tag = store.tags.find(t => t.slug === slug);
      if (!tag) return [];
      result = result.filter(g => g.tags.includes(tag.name));
    }
  }

  // 排序
  switch (opts.sort) {
    case 'rating':
      result.sort((a, b) => avgRating(b) - avgRating(a));
      break;
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
      break;
    case 'hours':
      result.sort((a, b) => (b.playHours || 0) - (a.playHours || 0));
      break;
    case 'year':
      result.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
      break;
    default:
      result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  // 把 tag 名换成 tag 对象（兼容组件接口）
  return result.map(g => ({
    ...g,
    tags: g.tags.map(tagName => {
      const found = store.tags.find(t => t.name === tagName);
      return found || { id: '', name: tagName, slug: '' };
    }).filter(t => t.id),
  }));
}

export async function getGameById(id: string): Promise<GameWithTags | null> {
  const store = await readStore();
  const game = store.games.find(g => g.id === id);
  if (!game) return null;

  return {
    ...game,
    tags: game.tags.map(tagName => {
      const found = store.tags.find(t => t.name === tagName);
      return found || { id: '', name: tagName, slug: '' };
    }).filter(t => t.id),
  };
}

export async function getStats() {
  const store = await readStore();
  const allGames = store.games;

  const total = allGames.length;
  const totalHours = allGames.reduce((s, g) => s + (g.playHours || 0), 0);

  const platformCount: Record<string, number> = {};
  for (const g of allGames) {
    for (const p of g.platforms || []) {
      platformCount[p] = (platformCount[p] || 0) + 1;
    }
  }

  const statusCount: Record<string, number> = {};
  for (const g of allGames) {
    statusCount[g.playStatus] = (statusCount[g.playStatus] || 0) + 1;
  }

  const yearStats: Record<string, { count: number; hours: number }> = {};
  for (const g of allGames) {
    if (g.startedDate) {
      const year = g.startedDate.slice(0, 4);
      if (!yearStats[year]) yearStats[year] = { count: 0, hours: 0 };
      yearStats[year].count++;
      yearStats[year].hours += g.playHours || 0;
    }
  }

  const completedCount = allGames.filter(g =>
    ['completed', 'platinum', 'replayed'].includes(g.playStatus)
  ).length;
  const droppedCount = allGames.filter(g => g.playStatus === 'dropped').length;

  const ratingBuckets: Record<string, number> = { '6以下': 0, '6-7': 0, '7-8': 0, '8-9': 0, '9+': 0 };
  for (const g of allGames) {
    const avg = avgRating(g);
    if (avg === 0) continue;
    if (avg < 6) ratingBuckets['6以下']++;
    else if (avg < 7) ratingBuckets['6-7']++;
    else if (avg < 8) ratingBuckets['7-8']++;
    else if (avg < 9) ratingBuckets['8-9']++;
    else ratingBuckets['9+']++;
  }

  return {
    total, totalHours, platformCount, statusCount, yearStats,
    completedCount, droppedCount,
    completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    dropRate: total > 0 ? Math.round((droppedCount / total) * 100) : 0,
    ratingBuckets,
  };
}

// ---- 增删改 ----

export async function createGame(data: {
  title: string; titleEn?: string; coverUrl?: string;
  developer?: string; publisher?: string; releaseYear?: number;
  platforms: string[]; playStatus: string;
  ratingPlot?: number; ratingGameplay?: number; ratingVisual?: number;
  ratingAudio?: number; ratingFeel?: number; ratingNarrative?: number;
  reviewText?: string; playHours?: number;
  startedDate?: string; completedDate?: string;
  tagNames: string[];  // 直接用标签名
}) {
  const store = await readStore();
  const now = new Date().toISOString();

  const game: GameItem = {
    id: uuid(),
    title: data.title,
    titleEn: data.titleEn,
    coverUrl: data.coverUrl,
    developer: data.developer,
    publisher: data.publisher,
    releaseYear: data.releaseYear,
    platforms: data.platforms,
    playStatus: data.playStatus,
    ratingPlot: data.ratingPlot ?? null,
    ratingGameplay: data.ratingGameplay ?? null,
    ratingVisual: data.ratingVisual ?? null,
    ratingAudio: data.ratingAudio ?? null,
    ratingFeel: data.ratingFeel ?? null,
    ratingNarrative: data.ratingNarrative ?? null,
    reviewText: data.reviewText,
    playHours: data.playHours ?? null,
    startedDate: data.startedDate,
    completedDate: data.completedDate,
    tags: data.tagNames,
    createdAt: now,
    updatedAt: now,
  };

  store.games.push(game);

  // 自动注册新标签
  for (const tagName of data.tagNames) {
    if (!store.tags.find(t => t.name === tagName)) {
      store.tags.push({ id: uuid(), name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') });
    }
  }

  await saveStore(store);
  return game.id;
}

export async function updateGame(id: string, data: {
  title: string; titleEn?: string; coverUrl?: string;
  developer?: string; publisher?: string; releaseYear?: number;
  platforms: string[]; playStatus: string;
  ratingPlot?: number; ratingGameplay?: number; ratingVisual?: number;
  ratingAudio?: number; ratingFeel?: number; ratingNarrative?: number;
  reviewText?: string; playHours?: number;
  startedDate?: string; completedDate?: string;
  tagNames: string[];
}) {
  const store = await readStore();
  const idx = store.games.findIndex(g => g.id === id);
  if (idx === -1) throw new Error('Game not found');

  const now = new Date().toISOString();
  store.games[idx] = {
    ...store.games[idx],
    title: data.title,
    titleEn: data.titleEn,
    coverUrl: data.coverUrl,
    developer: data.developer,
    publisher: data.publisher,
    releaseYear: data.releaseYear,
    platforms: data.platforms,
    playStatus: data.playStatus,
    ratingPlot: data.ratingPlot ?? null,
    ratingGameplay: data.ratingGameplay ?? null,
    ratingVisual: data.ratingVisual ?? null,
    ratingAudio: data.ratingAudio ?? null,
    ratingFeel: data.ratingFeel ?? null,
    ratingNarrative: data.ratingNarrative ?? null,
    reviewText: data.reviewText,
    playHours: data.playHours ?? null,
    startedDate: data.startedDate,
    completedDate: data.completedDate,
    tags: data.tagNames,
    updatedAt: now,
  };

  // 自动注册新标签
  for (const tagName of data.tagNames) {
    if (!store.tags.find(t => t.name === tagName)) {
      store.tags.push({ id: uuid(), name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') });
    }
  }

  await saveStore(store);
}

export async function deleteGame(id: string) {
  const store = await readStore();
  store.games = store.games.filter(g => g.id !== id);
  await saveStore(store);
}

// ---- 辅助 ----

export function avgRating(g: GameItem): number {
  const ratings = [
    g.ratingPlot, g.ratingGameplay, g.ratingVisual,
    g.ratingAudio, g.ratingFeel, g.ratingNarrative,
  ].filter((r): r is number => r != null);
  if (ratings.length === 0) return 0;
  return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
}
