import type { RoomRecord } from '../types';

interface RoomMapProps {
  rooms: RoomRecord[];
  onSelectRoom: (roomId: string) => void;
}

export function RoomMap({ rooms, onSelectRoom }: RoomMapProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Map rooms</h2>
          <p className="text-sm text-slate-600">Room records feeding map data.</p>
        </div>
        <span className="text-sm font-medium text-slate-500">{rooms.length} rooms</span>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
          Create a room and run a test to add it here.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              className="min-h-28 rounded-md border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-signal-600 hover:bg-teal-50"
              type="button"
              onClick={() => onSelectRoom(room.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{room.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{room.location}</p>
                </div>
                <SpeedBadge speed={room.lastSpeedMbps} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span>Avg {room.averageSpeedMbps?.toFixed(1) ?? '-'} Mbps</span>
                <span className="text-right">{room.testCount} logs</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function SpeedBadge({ speed }: { speed: number | null }) {
  const tone =
    speed === null
      ? 'bg-slate-200 text-slate-600'
      : speed >= 40
        ? 'bg-emerald-100 text-emerald-800'
        : speed >= 15
          ? 'bg-amber-100 text-amber-800'
          : 'bg-red-100 text-red-700';

  return (
    <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${tone}`}>
      {speed === null ? 'No log' : `${speed} Mbps`}
    </span>
  );
}
