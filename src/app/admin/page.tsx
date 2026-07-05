import { getGames } from '@/lib/data';
import { statusLabel, formatDate } from '@/lib/utils';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminPage() {
  const games = await getGames({});

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">游戏管理</h1>

      <div className="space-y-2">
        {games.map((game) => (
          <div key={game.id} className="card p-4 flex items-center gap-4">
            {game.coverUrl && (
              <img src={game.coverUrl} alt="" className="w-16 h-10 object-cover rounded" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{game.title}</div>
              <div className="text-xs text-text-muted">
                {statusLabel(game.playStatus)} · {formatDate(game.updatedAt)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/games/${game.id}/edit`}
                className="px-3 py-1 text-sm rounded border border-border text-text-muted
                           hover:text-text hover:border-accent/50 transition-all"
              >
                编辑
              </Link>
              <DeleteButton gameId={game.id} gameTitle={game.title} />
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-10 text-text-muted">
          <p>还没有游戏记录</p>
          <Link href="/admin/games/new" className="text-accent hover:underline mt-2 inline-block">
            添加第一款游戏
          </Link>
        </div>
      )}
    </div>
  );
}
