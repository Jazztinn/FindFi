import { X } from 'lucide-react';
import type { RoomRecord, SpeedTestRecord } from '../types';

interface RoomHistoryProps {
  room: RoomRecord;
  tests: SpeedTestRecord[];
  onClose: () => void;
}

export function RoomHistory({ room, tests, onClose }: RoomHistoryProps) {
  const speeds = tests.map((test) => test.speedMbps);
  const average = speeds.length ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length : 0;
  const min = speeds.length ? Math.min(...speeds) : 0;
  const max = speeds.length ? Math.max(...speeds) : 0;

  return (
    <div className="fixed inset-0 z-20 bg-slate-950/40 p-4">
      <section className="mx-auto mt-10 max-h-[calc(100vh-5rem)] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{room.name}</h2>
            <p className="text-sm text-slate-600">{room.location}</p>
          </div>
          <button
            className="grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Close history"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 border-b border-slate-200 p-4">
          <Stat label="Average" value={`${average.toFixed(1)} Mbps`} />
          <Stat label="Min" value={`${min.toFixed(1)} Mbps`} />
          <Stat label="Max" value={`${max.toFixed(1)} Mbps`} />
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {tests.length === 0 ? (
            <p className="p-4 text-sm text-slate-600">No history for this room.</p>
          ) : (
            tests.map((test) => (
              <div
                key={test.id}
                className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-950">{test.speedMbps} Mbps</p>
                  <p className="text-sm text-slate-500">{test.location}</p>
                  <p className="text-sm text-slate-500">{test.timestamp.toLocaleString()}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{test.latencyMs} ms</p>
                  <p>{Math.round(test.durationSeconds / 60)} min</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}
