import { AlertTriangle, Trophy } from 'lucide-react';
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
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mt-2">
      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <Trophy className="text-blue-600 mt-0.5" size={24} />
          <div>
            <h2 className="text-lg font-bold text-slate-950">Leaderboard</h2>
            <p className="text-sm text-slate-500">{statusLabel(status)}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {rows.length} rooms
        </span>
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
              className="grid w-full grid-cols-[60px_1fr_auto] items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
              type="button"
              onClick={() => onSelectRoom(test.id)}
            >
              <RankIcon index={index} isSlowest={index === rows.length - 1} />
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-950">{test.name}</p>
                <p className="truncate text-sm text-slate-600">{test.location}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {test.testCount} logs · updated {timeAgo(test.updatedAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
                  Last Speed
                </p>
                <SpeedText speed={test.lastSpeedMbps} />
                <p className="text-[10px] uppercase text-slate-500 tracking-wider">Mbps</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function SpeedText({ speed }: { speed: number | null }) {
  const tone =
    speed === null
      ? 'text-slate-400'
      : speed >= 40
        ? 'text-blue-600'
        : speed >= 15
          ? 'text-green-600'
          : 'text-orange-500';

  return (
    <span className={`block text-2xl font-bold leading-none tracking-tight ${tone}`}>
      {speed === null ? '-' : speed.toFixed(1)}
    </span>
  );
}

function RankIcon({ index, isSlowest }: { index: number; isSlowest: boolean }) {
  if (index < 3) {
    const colors = [
      'bg-amber-400 text-amber-900', // Gold
      'bg-slate-300 text-slate-700', // Silver
      'bg-orange-300 text-orange-900', // Bronze
    ];
    
    return (
      <div className="relative flex items-center justify-center">
        <div className={`grid size-10 place-items-center rounded-full font-bold shadow-sm z-10 ${colors[index]}`}>
          {index + 1}
        </div>
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-[12px] border-b-0 ${
          index === 0 ? 'border-t-amber-500' : index === 1 ? 'border-t-slate-400' : 'border-t-orange-400'
        }`} />
        <div className={`absolute -bottom-2 left-[4px] border-[8px] border-transparent border-t-[12px] border-b-0 ${
          index === 0 ? 'border-t-amber-500' : index === 1 ? 'border-t-slate-400' : 'border-t-orange-400'
        }`} style={{ transform: 'rotate(15deg)' }} />
        <div className={`absolute -bottom-2 right-[4px] border-[8px] border-transparent border-t-[12px] border-b-0 ${
          index === 0 ? 'border-t-amber-500' : index === 1 ? 'border-t-slate-400' : 'border-t-orange-400'
        }`} style={{ transform: 'rotate(-15deg)' }} />
      </div>
    );
  }

  if (isSlowest) {
    return (
      <div className="flex justify-center">
        <AlertTriangle className="text-red-500" size={24} aria-label="Slowest result" />
      </div>
    );
  }

  return <span className="block text-center text-sm font-semibold text-slate-400">#{index + 1}</span>;
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
