import type { Filters, RecencyFilter } from '../types';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Minimum speed
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={filters.minSpeedMbps}
          onChange={(event) =>
            onFiltersChange({ ...filters, minSpeedMbps: Number(event.target.value) })
          }
        />
        <span className="text-xs text-slate-500">{filters.minSpeedMbps} Mbps</span>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Recency
        <select
          className="h-10 rounded-md border border-slate-300 bg-white px-3"
          value={filters.recency}
          onChange={(event) =>
            onFiltersChange({ ...filters, recency: event.target.value as RecencyFilter })
          }
        >
          <option value="hour">Last hour</option>
          <option value="day">Last day</option>
          <option value="all">All time</option>
        </select>
      </label>
    </section>
  );
}
