import { Info, Trash2 } from 'lucide-react';
import type { DataStatus } from '../types';

interface LocalDemoControlsProps {
  status: DataStatus;
  onClear: () => void;
}

export function LocalDemoControls({ status, onClear }: LocalDemoControlsProps) {
  if (status !== 'env-missing') return null;

  return (
    <div className="flex flex-col gap-3">
      <section className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-sm text-blue-600">
        <Info size={18} />
        <p className="text-sm">Local demo mode. Data is stored in this browser.</p>
      </section>
      
      <button
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        type="button"
        onClick={onClear}
      >
        <Trash2 size={16} />
        Clear demo data
      </button>
    </div>
  );
}
