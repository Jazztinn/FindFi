export const firestoreCollections = {
  rooms: 'rooms',
  speedTests: 'speed_tests',
} as const;

export const firestoreFields = {
  room: {
    name: 'name',
    location: 'location',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    lastSpeedMbps: 'last_speed_mbps',
    averageSpeedMbps: 'average_speed_mbps',
    testCount: 'test_count',
  },
  speedTest: {
    roomId: 'room_id',
    roomName: 'room_name',
    location: 'location',
    speedMbps: 'speed_mbps',
    latencyMs: 'latency_ms',
    timestamp: 'timestamp',
    userId: 'user_id',
    durationSeconds: 'test_duration_seconds',
  },
} as const;
