import { useState } from 'react';
import { Gauge, Loader2, Plus } from 'lucide-react';
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">Run test</h2>
        <p className="mt-1 text-sm text-slate-600">Create room entry, log location, then test.</p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Room
          <input
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-950"
            value={selection.room}
            onChange={(event) => onSelectionChange({ ...selection, room: event.target.value })}
            placeholder="Room 612"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Location
          <input
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-950"
            value={selection.location}
            onChange={(event) => onSelectionChange({ ...selection, location: event.target.value })}
            placeholder="6th floor, east hallway"
          />
        </label>

        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Test length: 1 minute
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-signal-700 px-4 font-semibold text-white transition hover:bg-signal-900 disabled:cursor-not-allowed disabled:bg-slate-400"
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
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={state === 'testing'}
            onClick={handleNewRoom}
          >
            <Plus size={18} aria-hidden="true" />
            New room
          </button>

          <button
            className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-4 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={state !== 'testing'}
            onClick={() => abortController?.abort()}
          >
            Cancel
          </button>
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
