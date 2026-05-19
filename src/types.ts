export type RecencyFilter = 'hour' | 'day' | 'all';

export interface RoomSelection {
  room: string;
  location: string;
}

export interface Filters {
  minSpeedMbps: number;
  recency: RecencyFilter;
}

export interface SpeedTestResult {
  speedMbps: number;
  latencyMs: number;
  durationSeconds: number;
  measuredBytes: number;
}

export interface RoomRecord {
  id: string;
  name: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  lastSpeedMbps: number | null;
  averageSpeedMbps: number | null;
  testCount: number;
}

export interface SpeedTestRecord {
  id: string;
  roomId: string;
  roomName: string;
  location: string;
  speedMbps: number;
  latencyMs: number;
  durationSeconds: number;
  timestamp: Date;
  userId: 'anonymous';
  metadata: ClientMetadata;
}

export interface ClientMetadata {
  userAgent: string;
  connectionEffectiveType: string | null;
  connectionDownlinkMbps: number | null;
  connectionRttMs: number | null;
}

export type DataStatus = 'env-missing' | 'loading' | 'ready' | 'error';
