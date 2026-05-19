import { getSpeedTestFileUrl } from './env';
import type { SpeedTestResult } from '../types';

const requestTimeoutMs = 20_000;

export async function runSpeedTest(durationMinutes: number): Promise<SpeedTestResult> {
  const targetMs = clamp(durationMinutes, 1, 5) * 60_000;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), targetMs + requestTimeoutMs);
  const start = performance.now();
  let measuredBytes = 0;
  let lastLatencyMs = 0;

  try {
    while (performance.now() - start < targetMs) {
      const requestStart = performance.now();
      const response = await fetch(`${getSpeedTestFileUrl()}?cacheBust=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Speed test file returned HTTP ${response.status}`);
      }

      const blob = await response.blob();
      measuredBytes += blob.size;
      lastLatencyMs = Math.round(performance.now() - requestStart);
    }

    const end = performance.now();
    const durationSeconds = (end - start) / 1000;
    const speedMbps = (measuredBytes * 8) / durationSeconds / 1_000_000;

    return {
      speedMbps: Math.round(speedMbps * 2) / 2,
      latencyMs: lastLatencyMs,
      durationSeconds: Math.round(durationSeconds * 10) / 10,
      measuredBytes,
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
