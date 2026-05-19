import { useMemo, useState } from 'react';
import { Wifi } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { Leaderboard } from './components/Leaderboard';
import { LocalDemoControls } from './components/LocalDemoControls';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { RoomHistory } from './components/RoomHistory';
import { RoomMap } from './components/RoomMap';
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
  const { rooms, tests, status, saveRoomTest, clearLocalDemoData } = useSpeedTests();

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
    <main className="min-h-screen text-slate-900 pb-12">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Wifi size={32} className="text-blue-600" aria-hidden="true" />
            <div className="leading-tight">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">WiFi Tester</h1>
              <p className="text-sm text-slate-500">Room/location WiFi logs for map data</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PWAInstallPrompt />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 sm:px-6">
        
        <RoomSelector
          selection={selectedRoom}
          onSelectionChange={setSelectedRoom}
          onSaved={handleSaved}
        />

        <LocalDemoControls status={status} onClear={clearLocalDemoData} />

        <FilterBar filters={filters} onFiltersChange={setFilters} />
        
        <RoomMap rooms={rooms} onSelectRoom={setHistoryRoom} />

        <Leaderboard
          filters={filters}
          rooms={rooms}
          status={status}
          onSelectRoom={setHistoryRoom}
        />
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


