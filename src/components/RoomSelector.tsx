import { useState } from 'react';
import { Clock, DoorOpen, Gauge, Loader2, MapPin, Plus, Radio } from 'lucide-react';
import { runSpeedTest } from '../lib/speedTest';
import type { RoomSelection, SpeedTestResult } from '../types';

const testDurationMinutes = 1;

interface RoomSelectorProps {
  selection: RoomSelection;
  onSelectionChange: (selection: RoomSelection) => void;
  onSaved: (selection: RoomSelection, result: SpeedTestResult) => Promise<void>;
}

export function RoomSelector({ selection, onSelectionChange, onSaved }: RoomSelectorProps) {
  const [state, setState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  async function handleRunTest() {
    if (!selection.room.trim() || !selection.location.trim()) {
      setState('error');
      setMessage('Room and location are required.');
      return;
    }

    setState('testing');
    setMessage('Testing connection for 1 minute...');
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const result = await runSpeedTest(testDurationMinutes, controller.signal);
      if (result.speedMbps <= 0 || result.speedMbps > 2000) {
        throw new Error('Speed result outside valid range. No log saved.');
      }

      await onSaved(
        {
          room: selection.room.trim(),
          location: selection.location.trim(),
        },
        result,
      );
      setState('success');
      setMessage(`${selection.room} updated with ${result.speedMbps} Mbps log`);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setState('idle');
        setMessage('Test canceled. No log saved.');
        return;
      }

      setState('error');
      setMessage(error instanceof Error ? error.message : 'Speed test failed');
    } finally {
      setAbortController(null);
    }
  }

  function handleNewRoom() {
    onSelectionChange({ room: '', location: '' });
    setState('idle');
    setMessage(null);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <Radio className="text-blue-600" size={24} />
        <div>
          <h2 className="text-lg font-bold text-slate-950">Run test</h2>
          <p className="text-sm text-slate-500">Create room entry, log location, then test.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
            Room
            <div className="relative">
              <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={selection.room}
                onChange={(event) => onSelectionChange({ ...selection, room: event.target.value })}
                placeholder="Room 612"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
            Location
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={selection.location}
                onChange={(event) => onSelectionChange({ ...selection, location: event.target.value })}
                placeholder="6th floor, east hallway"
              />
            </div>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Test length
          <div className="relative max-w-[200px]">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              defaultValue="1"
            >
              <option value="1">1 minute</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </label>

        <div className="mt-4 flex flex-col gap-3">
          <button
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="button"
            disabled={state === 'testing'}
            onClick={handleRunTest}
          >
            {state === 'testing' ? (
              <Loader2 className="animate-spin" size={20} aria-hidden="true" />
            ) : (
              <Gauge size={20} aria-hidden="true" />
            )}
            Test WiFi
          </button>

          <button
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={state === 'testing'}
            onClick={handleNewRoom}
          >
            <Plus size={20} aria-hidden="true" />
            New room
          </button>

          {state === 'testing' && (
            <button
              className="inline-flex h-10 w-full items-center justify-center font-semibold text-slate-500 transition hover:text-slate-700"
              type="button"
              onClick={() => abortController?.abort()}
            >
              Cancel
            </button>
          )}
          {state !== 'testing' && (
            <div className="h-10 flex items-center justify-center">
              <span className="font-semibold text-slate-400 cursor-not-allowed">Cancel</span>
            </div>
          )}
        </div>

        {message ? (
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              state === 'error' ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-teal-800'
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}

