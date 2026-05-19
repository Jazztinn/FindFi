import { Calendar } from 'lucide-react';
import type { Filters, RecencyFilter } from '../types';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label className="flex flex-col gap-3 text-sm font-medium text-slate-800">
        Minimum speed
        <div className="flex items-center gap-4">
          <input
            className="flex-1"
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minSpeedMbps}
            onChange={(event) =>
              onFiltersChange({ ...filters, minSpeedMbps: Number(event.target.value) })
            }
            style={{
              '--range-progress': `${filters.minSpeedMbps}%`,
            } as React.CSSProperties}
          />
          <span className="w-14 text-right font-semibold text-slate-950">{filters.minSpeedMbps} Mbps</span>
        </div>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
        Recency
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={filters.recency}
            onChange={(event) =>
              onFiltersChange({ ...filters, recency: event.target.value as RecencyFilter })
            }
          >
            <option value="hour">Last hour</option>
            <option value="day">Last day</option>
            <option value="all">All time</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </label>
    </section>
  );
}
