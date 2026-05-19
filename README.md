# WiFi Tester

Standalone tester component for logging room/location WiFi results. Not the full FindFi application.

## Local dev

```bash
npm install
npm run generate:speed-file
npm run dev
```

Copy `.env.example` to `.env.local` when Firebase is ready. For now the app runs locally with demo data and a generated local speed-test file.

## Data contract

This tester writes shared Firestore collections that the full FindFi app can read:

- `rooms/{room_id}`: map-ready room records with `name`, `location`, `last_speed_mbps`, `average_speed_mbps`, `test_count`, `created_at`, and `updated_at`.
- `speed_tests/{test_id}`: append-only logs with `room_id`, `room_name`, `location`, `speed_mbps`, `latency_ms`, `test_duration_seconds`, `timestamp`, and `user_id`.

The tester owns room creation and test logging. FindFi should treat these collections as shared source data for map rendering, room updates, history, and analytics.
