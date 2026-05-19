# WiFi Tester

Standalone tester component for logging room/location WiFi results. Not the full FindFi application.

Each test runs for exactly 1 minute.

Results at or below `0 Mbps`, or above `2000 Mbps`, are rejected as invalid and are not logged.

## Local dev

```bash
npm install
npm run generate:speed-file
npm run dev
```

Copy `.env.example` to `.env.local` when Firebase is ready. For now the app runs locally with demo data, localStorage persistence, a clear-demo-data control, and a generated local speed-test file.

## Data contract

This tester writes shared Firestore collections that the full FindFi app can read:

- `rooms/{room_id}`: map-ready room records with `name`, `location`, `last_speed_mbps`, `average_speed_mbps`, `test_count`, `created_at`, and `updated_at`.
- `speed_tests/{test_id}`: append-only logs with `room_id`, `room_name`, `location`, `speed_mbps`, `latency_ms`, `test_duration_seconds`, `timestamp`, `user_id`, `user_agent`, `connection_effective_type`, `connection_downlink_mbps`, and `connection_rtt_ms`.

The tester owns room creation and test logging. FindFi should treat these collections as shared source data for map rendering, room updates, history, and analytics.

When a user enters an existing room name again, the tester reuses the same `room_id`, updates the room location/summary fields, and appends a new `speed_tests` log. Duplicate room records are not created for repeated room names. Room `location` uses latest-write-wins semantics so users can correct map/source text over time.
