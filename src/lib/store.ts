// 数据存储抽象层
// 本地 dev: 读写 ./data/store.json
// 生产环境: 读写 Vercel Blob (BLOB_READ_WRITE_TOKEN 自动注入)

import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'fs/promises';

// ---- 数据类型 ----

export interface GameItem {
  id: string;
  title: string;
  titleEn?: string;
  coverUrl?: string;
  developer?: string;
  publisher?: string;
  releaseYear?: number;
  platforms: string[];
  playStatus: string;
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
  isFeatured?: boolean;
  sortOrder?: number;
  tags: string[];          // 标签名列表（非规范化）
  createdAt: string;
  updatedAt: string;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
}

export interface StoreData {
  games: GameItem[];
  tags: TagItem[];
}

// ---- 默认数据 ----

const DEFAULT_TAGS: TagItem[] = [
  { id: 'open-world', name: '开放世界', slug: 'open-world' },
  { id: 'soulslike', name: '魂系', slug: 'soulslike' },
  { id: 'indie', name: '独立游戏', slug: 'indie' },
  { id: 'jrpg', name: 'JRPG', slug: 'jrpg' },
  { id: 'crpg', name: 'CRPG', slug: 'crpg' },
  { id: 'action', name: '动作', slug: 'action' },
  { id: 'fps', name: 'FPS', slug: 'fps' },
  { id: 'roguelike', name: 'Roguelike', slug: 'roguelike' },
  { id: 'sim', name: '模拟经营', slug: 'sim' },
  { id: 'strategy', name: '策略', slug: 'strategy' },
  { id: 'puzzle', name: '解谜', slug: 'puzzle' },
  { id: 'horror', name: '恐怖', slug: 'horror' },
  { id: 'scifi', name: '科幻', slug: 'scifi' },
  { id: 'fantasy', name: '奇幻', slug: 'fantasy' },
  { id: 'coop', name: '双人合作', slug: 'coop' },
  { id: 'chinese', name: '有中文', slug: 'chinese' },
  { id: '60fps', name: '60fps', slug: '60fps' },
  { id: 'multiplayer', name: '多人联机', slug: 'multiplayer' },
];

// ---- 缓存 ----

let _cache: StoreData | null = null;

// ---- 核心 API ----

export async function readStore(): Promise<StoreData> {
  if (_cache) return _cache;

  // 尝试从 Vercel Blob 读取（生产环境）
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list();
      const blob = blobs.find(b => b.pathname === 'store.json');
      if (blob) {
        const resp = await fetch(blob.url);
        _cache = await resp.json();
        return _cache!;
      }
    } catch { /* fallthrough to local */ }
  }

  // 本地文件读取
  try {
    const raw = await readFile('./data/store.json', 'utf-8');
    _cache = JSON.parse(raw);
    return _cache!;
  } catch { /* file doesn't exist yet */ }

  // 全新初始化
  _cache = { games: [], tags: DEFAULT_TAGS };
  return _cache;
}

async function persist(data: StoreData): Promise<void> {
  _cache = data;

  // 写入 Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put('store.json', JSON.stringify(data), { access: 'public' });
    } catch { /* network error, continue */ }
  }

  // 写入本地文件
  try {
    await mkdir('./data', { recursive: true });
    await writeFile('./data/store.json', JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* permission error, non-fatal */ }
}

export async function saveStore(data: StoreData): Promise<void> {
  await persist(data);
}

// 强制刷新缓存（写入后不需要，但用于调试）
export function clearCache(): void {
  _cache = null;
}
