import { AlertTriangle, Medal } from 'lucide-react';
import type { DataStatus, Filters, RoomRecord } from '../types';

interface LeaderboardProps {
  rooms: RoomRecord[];
  filters: Filters;
  status: DataStatus;
  onSelectRoom: (roomId: string) => void;
}

export function Leaderboard({ rooms, filters, status, onSelectRoom }: LeaderboardProps) {
  const rows = filterRooms(rooms, filters).sort(
    (a, b) => (b.lastSpeedMbps ?? 0) - (a.lastSpeedMbps ?? 0),
  );

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Leaderboard</h2>
          <p className="text-sm text-slate-600">{statusLabel(status)}</p>
        </div>
        <span className="text-sm font-medium text-slate-500">{rows.length} rooms</span>
      </div>

      {rows.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-slate-600">
          No tests match current filters.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {rows.map((test, index) => (
            <button
              key={test.id}
              className="grid w-full grid-cols-[44px_1fr_auto] items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
              type="button"
              onClick={() => onSelectRoom(test.id)}
            >
              <RankIcon index={index} isSlowest={index === rows.length - 1} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-950">{test.name}</p>
                <p className="truncate text-sm text-slate-500">{test.location}</p>
                <p className="text-sm text-slate-500">
                  {test.testCount} logs · updated {timeAgo(test.updatedAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-950">
                  {test.lastSpeedMbps?.toFixed(1) ?? '-'}
                </p>
                <p className="text-xs uppercase tracking-normal text-slate-500">last Mbps</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function RankIcon({ index, isSlowest }: { index: number; isSlowest: boolean }) {
  if (index < 3) {
    const colors = ['text-amber-500', 'text-slate-400', 'text-orange-600'];
    return <Medal className={colors[index]} size={24} aria-label={`Rank ${index + 1}`} />;
  }

  if (isSlowest) {
    return <AlertTriangle className="text-red-500" size={22} aria-label="Slowest result" />;
  }

  return <span className="text-sm font-semibold text-slate-400">#{index + 1}</span>;
}

function filterRooms(rooms: RoomRecord[], filters: Filters) {
  const now = Date.now();
  const minTimestamp =
    filters.recency === 'hour'
      ? now - 60 * 60 * 1000
      : filters.recency === 'day'
        ? now - 24 * 60 * 60 * 1000
        : 0;

  return rooms.filter((room) => {
    const speedMatches = (room.lastSpeedMbps ?? 0) >= filters.minSpeedMbps;
    const recencyMatches = room.updatedAt.getTime() >= minTimestamp;
    return speedMatches && recencyMatches;
  });
}

function statusLabel(status: DataStatus) {
  if (status === 'env-missing') return 'Demo data active until Firebase env is configured.';
  if (status === 'loading') return 'Loading live Firestore results...';
  if (status === 'error') return 'Firestore listener failed.';
  return 'Live Firestore results.';
}

function timeAgo(date: Date) {
  const seconds = Math.max(1, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
