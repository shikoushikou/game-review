import { statusLabel, statusColor } from '@/lib/utils';
import type { PlayStatus } from '@/db/schema';

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{
        background: `${statusColor(status)}20`,
        color: statusColor(status),
        border: `1px solid ${statusColor(status)}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: statusColor(status) }}
      />
      {statusLabel(status)}
    </span>
  );
}
