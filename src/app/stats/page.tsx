import { getStats } from '@/lib/data';
import { statusLabel, statusColor } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '统计 - Game Reviews' };

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">📊 游戏统计</h1>

      {/* 总览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="评测游戏" value={stats.total} unit="款" />
        <StatCard label="总时长" value={Math.round(stats.totalHours)} unit="小时" />
        <StatCard label="完成率" value={stats.completionRate} unit="%" color="green" />
        <StatCard label="弃坑率" value={stats.dropRate} unit="%" color="red" />
      </div>

      {/* 游玩状态分布 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">游玩状态</h2>
        <div className="space-y-3">
          {Object.entries(stats.statusCount).map(([status, count]) => {
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="text-sm w-20" style={{ color: statusColor(status) }}>
                  {statusLabel(status)}
                </span>
                <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: statusColor(status),
                    }}
                  />
                </div>
                <span className="text-sm text-text-muted w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 平台分布 */}
      {Object.keys(stats.platformCount).length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">平台分布</h2>
          <div className="space-y-3">
            {Object.entries(stats.platformCount)
              .sort(([, a], [, b]) => b - a)
              .map(([platform, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={platform} className="flex items-center gap-3">
                    <span className="text-sm w-20">{platform}</span>
                    <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                        }}
                      />
                    </div>
                    <span className="text-sm text-text-muted w-12 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 评分分布 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">评分分布</h2>
        <div className="space-y-3">
          {Object.entries(stats.ratingBuckets).map(([range, count]) => {
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={range} className="flex items-center gap-3">
                <span className="text-sm w-16">{range}</span>
                <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #fbbf24, #f87171)',
                    }}
                  />
                </div>
                <span className="text-sm text-text-muted w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 年度统计 */}
      {Object.keys(stats.yearStats).length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">年度统计</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text-muted font-medium">年份</th>
                  <th className="text-right py-2 text-text-muted font-medium">游戏数</th>
                  <th className="text-right py-2 text-text-muted font-medium">总时长</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.yearStats)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([year, data]) => (
                    <tr key={year} className="border-b border-border">
                      <td className="py-2 font-medium">{year}</td>
                      <td className="py-2 text-right">{data.count} 款</td>
                      <td className="py-2 text-right">{Math.round(data.hours)} 小时</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, color }: {
  label: string; value: number; unit: string; color?: string;
}) {
  const colorClass = color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-accent';
  return (
    <div className="card p-4 text-center">
      <div className={`text-3xl font-bold ${colorClass}`}>{value}<span className="text-lg">{unit}</span></div>
      <div className="text-sm text-text-muted mt-1">{label}</div>
    </div>
  );
}
