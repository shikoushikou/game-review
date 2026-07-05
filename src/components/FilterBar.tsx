'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import TagChip from './TagChip';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  tags: Tag[];
  selectedTags: string[];
  selectedStatus: string;
  sort: string;
  search: string;
}

export default function FilterBar({ tags, selectedTags, selectedStatus, sort, search }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      // preserve current state
      const current = {
        q: search,
        sort,
        status: selectedStatus,
        tags: selectedTags.join(','),
        ...Object.fromEntries(Object.entries({ q: search, sort, status: selectedStatus, tags: selectedTags.join(',') }).filter(([_, v]) => v)),
        ...updates,
      };
      // clean empties
      Object.entries(current).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      startTransition(() => router.push(`/?${params.toString()}`));
    },
    [router, search, sort, selectedStatus, selectedTags, startTransition]
  );

  const toggleTag = (slug: string) => {
    const next = selectedTags.includes(slug)
      ? selectedTags.filter((t) => t !== slug)
      : [...selectedTags, slug];
    updateParams({ tags: next.join(',') });
  };

  return (
    <div className="space-y-4">
      {/* 搜索 + 排序 */}
      <div className="flex gap-3 items-center flex-wrap">
        <input
          type="text"
          placeholder="搜索游戏..."
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateParams({ q: (e.target as HTMLInputElement).value });
          }}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text
                     placeholder:text-text-muted focus:outline-none focus:border-accent/50
                     w-full sm:w-64 transition-colors"
        />
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text
                     focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
        >
          <option value="updated">最近更新</option>
          <option value="rating">评分最高</option>
          <option value="title">名称排序</option>
          <option value="hours">游玩时长</option>
          <option value="year">发行年份</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text
                     focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
        >
          <option value="">全部状态</option>
          <option value="completed">已通关</option>
          <option value="platinum">已白金</option>
          <option value="playing">在玩</option>
          <option value="dropped">弃坑</option>
          <option value="endless">永久在玩</option>
          <option value="replayed">多次重温</option>
          <option value="backlog">待玩</option>
        </select>
        {pending && <span className="text-text-muted text-sm animate-pulse">筛选...</span>}
      </div>

      {/* 标签筛选 */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <TagChip
            key={tag.id}
            name={tag.name}
            active={selectedTags.includes(tag.slug)}
            onClick={() => toggleTag(tag.slug)}
          />
        ))}
        {selectedTags.length > 0 && (
          <button
            onClick={() => updateParams({ tags: '' })}
            className="text-xs text-text-muted hover:text-text transition-colors px-2"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
