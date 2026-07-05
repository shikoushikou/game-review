'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ gameId, gameTitle }: { gameId: string; gameTitle: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`确定删除「${gameTitle}」？`)) return;

    const res = await fetch(`/api/games/${gameId}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 text-sm rounded border border-red-500/30 text-red-400
                 hover:bg-red-500/10 transition-all"
    >
      删除
    </button>
  );
}
