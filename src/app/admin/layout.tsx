import { requireAuth } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <div>
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-10 flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-text-muted hover:text-text">列表</Link>
          <Link href="/admin/games/new" className="text-accent hover:opacity-80">+ 新增游戏</Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
