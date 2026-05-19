import type { DataStatus } from '../types';

interface LocalDemoControlsProps {
  status: DataStatus;
  onClear: () => void;
}

export function LocalDemoControls({ status, onClear }: LocalDemoControlsProps) {
  if (status !== 'env-missing') return null;

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-amber-900">Local demo mode. Data is stored in this browser.</p>
      <button
        className="h-10 rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
        type="button"
        onClick={onClear}
      >
        Clear demo data
      </button>
    </section>
  );
}
