import { useMemo, useState } from 'react';
import { Wifi } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { Leaderboard } from './components/Leaderboard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { RoomMap } from './components/RoomMap';
import { RoomHistory } from './components/RoomHistory';
import { RoomSelector } from './components/RoomSelector';
import { useSpeedTests } from './hooks/useSpeedTests';
import type { Filters, RoomSelection, SpeedTestResult } from './types';

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
  const { rooms, tests, status, saveRoomTest } = useSpeedTests();

  const historyTests = useMemo(
    () => tests.filter((test) => test.roomId === historyRoom),
    [historyRoom, tests],
  );

  const selectedHistoryRoom = useMemo(
    () => rooms.find((room) => room.id === historyRoom) ?? null,
    [historyRoom, rooms],
  );

  const handleSaved = async (selection: RoomSelection, result: SpeedTestResult) => {
    await saveRoomTest(selection, result);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-signal-700 text-white">
              <Wifi size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
                WiFi Tester
              </h1>
              <p className="text-sm text-slate-600">Room/location WiFi logs for map data</p>
            </div>
          </div>
          <PWAInstallPrompt />
        </header>

        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <RoomSelector
            selection={selectedRoom}
            onSelectionChange={setSelectedRoom}
            onSaved={handleSaved}
          />

          <div className="flex flex-col gap-4">
            <FilterBar filters={filters} onFiltersChange={setFilters} />
            <RoomMap rooms={rooms} onSelectRoom={setHistoryRoom} />
            <Leaderboard
              filters={filters}
              rooms={rooms}
              status={status}
              onSelectRoom={setHistoryRoom}
            />
          </div>
        </section>
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
