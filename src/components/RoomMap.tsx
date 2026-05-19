import { ChevronRight, DoorOpen, Map } from 'lucide-react';
import type { RoomRecord } from '../types';

interface RoomMapProps {
  rooms: RoomRecord[];
  onSelectRoom: (roomId: string) => void;
}

export function RoomMap({ rooms, onSelectRoom }: RoomMapProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Map className="text-blue-600 mt-0.5" size={24} />
          <div>
            <h2 className="text-lg font-bold text-slate-950">Map rooms</h2>
            <p className="text-sm text-slate-500">Room records feeding map data.</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {rooms.length} rooms
        </span>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Create a room and run a test to add it here.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rooms.map((room, index) => {
            const iconBgs = ['bg-blue-50', 'bg-green-50', 'bg-purple-50'];
            const iconColors = ['text-blue-500', 'text-green-500', 'text-purple-500'];
            const colorIndex = index % 3;

            return (
              <button
                key={room.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
                type="button"
                onClick={() => onSelectRoom(room.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`grid size-12 shrink-0 place-items-center rounded-lg ${iconBgs[colorIndex]} ${iconColors[colorIndex]}`}>
                    <DoorOpen size={24} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="truncate font-bold text-slate-950">{room.name}</p>
                    <p className="truncate text-sm text-slate-600">{room.location}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Avg {room.averageSpeedMbps?.toFixed(1) ?? '-'} Mbps
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <SpeedText speed={room.lastSpeedMbps} />
                    <p className="text-[10px] uppercase text-slate-500 tracking-wider">Mbps</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </button>
            );
          })}
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
    <span className={`block text-xl font-bold leading-none tracking-tight ${tone}`}>
      {speed === null ? '-' : speed.toFixed(1)}
    </span>
  );
}
