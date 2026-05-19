import { useMemo, useState } from 'react';
import { Activity, Radio, Wifi } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { Leaderboard } from './components/Leaderboard';
import { LocalDemoControls } from './components/LocalDemoControls';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { RoomHistory } from './components/RoomHistory';
import { RoomSelector } from './components/RoomSelector';
import { useSpeedTests } from './hooks/useSpeedTests';
import type { DataStatus, Filters, RoomSelection, SpeedTestResult } from './types';

const initialFilters: Filters = {
  minSpeedMbps: 0,
  recency: 'all',
};

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<RoomSelection>({
    room: '',
    location: '',
  });
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [historyRoom, setHistoryRoom] = useState<string | null>(null);
  const { rooms, tests, status, saveRoomTest, clearLocalDemoData } = useSpeedTests();

  const historyTests = useMemo(
    () => tests.filter((test) => test.roomId === historyRoom),
    [historyRoom, tests],
  );

  const selectedHistoryRoom = useMemo(
    () => rooms.find((room) => room.id === historyRoom) ?? null,
    [historyRoom, rooms],
  );

  const stats = useMemo(() => {
    const withSpeed = rooms.filter((room) => room.lastSpeedMbps !== null);
    const speeds = withSpeed.map((room) => room.lastSpeedMbps as number);
    const fastest = speeds.length ? Math.max(...speeds) : 0;
    const average = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    return {
      rooms: rooms.length,
      logs: tests.length,
      fastest,
      average,
    };
  }, [rooms, tests]);

  const handleSaved = async (selection: RoomSelection, result: SpeedTestResult) => {
    await saveRoomTest(selection, result);
  };

  return (
    <main className="min-h-screen text-slate-900 pb-12">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-pop">
              <Wifi size={20} aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">FindFi</h1>
              <p className="text-xs text-slate-500">WiFi speed maps</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={status} />
            <PWAInstallPrompt />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
        
        <RoomSelector
          selection={selectedRoom}
          onSelectionChange={setSelectedRoom}
          onSaved={handleSaved}
        />

        <section className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <StatCard label="Rooms" value={stats.rooms.toString()} icon={<Radio size={16} />} />
          <StatCard label="Logs" value={stats.logs.toString()} icon={<Activity size={16} />} />
          <StatCard
            label="Fastest"
            value={`${stats.fastest.toFixed(1)}`}
            suffix="Mbps"
            accent
          />
          <StatCard
            label="Average"
            value={`${stats.average.toFixed(1)}`}
            suffix="Mbps"
          />
        </section>

        <LocalDemoControls status={status} onClear={clearLocalDemoData} />

        <div className="flex flex-col gap-4">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
          <Leaderboard
            filters={filters}
            rooms={rooms}
            status={status}
            onSelectRoom={setHistoryRoom}
          />
        </div>

        <footer className="pt-6 text-center text-xs text-slate-400">
          FindFi · Built for mapping WiFi coverage room-by-room
        </footer>
      </div>

      {selectedHistoryRoom ? (
        <RoomHistory
          room={selectedHistoryRoom}
          tests={historyTests}
          onClose={() => setHistoryRoom(null)}
        />
      ) : null}
    </main>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-card transition hover:shadow-pop ${
        accent ? 'border-brand-100 bg-gradient-to-br from-white to-brand-50/60' : 'border-slate-200/70'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {value}
        </span>
        {suffix ? (
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: DataStatus }) {
  const map: Record<DataStatus, { label: string; dot: string; bg: string; text: string }> = {
    ready: {
      label: 'Live',
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    loading: {
      label: 'Loading',
      dot: 'bg-brand-500 animate-pulse',
      bg: 'bg-brand-50',
      text: 'text-brand-700',
    },
    error: {
      label: 'Offline',
      dot: 'bg-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
    'env-missing': {
      label: 'Demo',
      dot: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
  };
  const s = map[status];
  return (
    <span
      className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${s.bg} ${s.text}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

