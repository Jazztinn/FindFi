# WiFi Speed Tester PWA - Project Plan

## Project Overview

Build a Progressive Web App (PWA) that allows campus students to test WiFi speed in their room/location and view a crowdsourced leaderboard of WiFi quality across the building. The app will display network speed by room, allowing users to find good WiFi spots and contribute data that improves the heatmap over time.

**Initial Scope:** 6th and 7th floors of one building

---

## Problem Statement

- Campus WiFi is available everywhere but highly variable in quality
- Some rooms are essentially unusable (2-8 Mbps) while others are fast (50+ Mbps)
- Students need to know WHERE good WiFi is available before they choose a study spot
- Manual surveying is not feasible (large campus, no dedicated staff)
- Solution: Crowdsource speed test data via a simple PWA

---

## Solution Architecture

### User Flow

1. **Student opens PWA** → Geolocation or manual room selection
2. **Clicks "Test WiFi"** → Automatic speed test runs (~10 seconds)
3. **Result submits** → Leaderboard updates in real-time
4. **Views results** → Leaderboard shows rooms ranked by speed (fastest → slowest)
5. **Filters data** → View by floor, see historical tests for specific rooms

### Core Features

#### Feature 1: Room Selection
- Dropdown with floor (6, 7) + room numbers (601-650, 701-750, etc.)
- Or freeform input for hallways/common areas ("6th Floor Main Hallway")
- Remembers last selected room for convenience

#### Feature 2: WiFi Speed Test
- One-click "Test WiFi" button
- Measures download speed by downloading a test file
- Displays live progress ("Testing... 25%")
- Returns speed in Mbps
- Captures timestamp automatically

#### Feature 3: Real-Time Leaderboard
- Shows all tested rooms sorted by speed (descending)
- Displays: Room Name | Speed (Mbps) | Last Tested (time ago)
- Highlights top 3 (gold/silver/bronze)
- Shows slowest at the bottom for context

#### Feature 4: Room History
- Click any room in leaderboard to see all historical tests
- Shows list: Speed | Timestamp | User (or anonymous)
- Calculate average speed for that room
- Display trend (improving/declining/stable)

#### Feature 5: Filters
- **By Floor:** Toggle 6th floor only, 7th floor only, or both
- **By Speed Range:** Show only rooms above X Mbps (e.g., "Show rooms > 30 Mbps")
- **By Recency:** Show tests from last hour, last day, all time

---

## Tech Stack

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Mapping/UI:** Leaflet.js (if we add map view later), or simple table for MVP
- **PWA:** Service Worker (offline caching, install prompt)
- **State Management:** React Context API (simple, no Redux needed)
- **Deployment:** Vercel (free tier)

### Backend
- **Database:** Firebase Firestore (real-time, free tier, no server to maintain)
- **Authentication:** Optional (anonymous for now, or email later)
- **Speed Test Server:** Host a ~10MB test file on Vercel or use Firebase Storage
- **API:** Firebase functions for aggregation/filtering (optional, Firestore queries work for MVP)

### DevTools
- **Build:** Vite (fast build, great DX)
- **Testing:** Vitest + React Testing Library (if needed)
- **Version Control:** Git

---

## Database Schema (Firestore)

### Collection: `speed_tests`
```json
{
  "id": "auto-generated",
  "room": "Room 601",
  "floor": 6,
  "speed_mbps": 48.5,
  "latency_ms": 25,
  "timestamp": "2026-05-19T14:35:00Z",
  "user_id": "anonymous" | "user_uuid",
  "test_duration_seconds": 8
}
```

### Collection: `room_stats` (optional, pre-computed for performance)
```json
{
  "id": "6-601",
  "room": "Room 601",
  "floor": 6,
  "avg_speed_mbps": 48.2,
  "max_speed_mbps": 52.0,
  "min_speed_mbps": 44.5,
  "test_count": 15,
  "last_updated": "2026-05-19T14:35:00Z"
}
```

---

## Frontend Components

### 1. `App.tsx` (Main Container)
- Routes between pages
- PWA shell setup
- Service worker registration

### 2. `RoomSelector.tsx`
- Dropdown for floor (6, 7)
- Dropdown/input for room number
- Display current selection
- "Test WiFi" button
- Loading state during test

### 3. `SpeedTestEngine.tsx` (Utility)
- Download test file from server
- Measure time elapsed
- Calculate Mbps: `(bytes * 8) / milliseconds`
- Return result object `{speed: number, timestamp: Date, latency: number}`

### 4. `Leaderboard.tsx` (Main Display)
- Real-time list sorted by speed (descending)
- Show room name, speed, last tested timestamp
- Click room → show history modal
- Display visual indicators (top 3 medals, bottom 1 warning)

### 5. `FilterBar.tsx`
- Floor toggle (6, 7, Both)
- Speed range slider (0-100 Mbps)
- Recency filter (Last hour, Last day, All time)
- Update leaderboard in real-time based on filters

### 6. `RoomHistory.tsx` (Modal/Detail View)
- Show all tests for selected room
- List: Speed | Timestamp | Trend indicator
- Calculate average, min, max
- Chart of speed over time (optional, Chart.js)

### 7. `PWAInstallPrompt.tsx`
- Detect if PWA is installable
- Show "Install App" button
- Add to homescreen instructions for iOS

---

## Speed Test Implementation

### Option 1: Host Test File (Recommended)
1. Create a 10MB dummy file (random binary data)
2. Upload to Vercel public folder or Firebase Storage
3. PWA fetches the file and measures time
4. Formula: `speed = (10 * 1024 * 1024 * 8) / time_ms` (Mbps)

### Option 2: Fetch Multiple Small Files
1. Fetch 5x 2MB files in sequence
2. Average the results
3. More accurate, handles network variance

### Code Stub
```javascript
async function runSpeedTest(testFileUrl) {
  const fileSize = 10 * 1024 * 1024; // 10 MB in bytes
  const startTime = performance.now();
  
  try {
    const response = await fetch(testFileUrl);
    const blob = await response.blob();
    const endTime = performance.now();
    
    const timeSec = (endTime - startTime) / 1000;
    const speedMbps = (blob.size * 8) / timeSec / 1_000_000;
    
    return {
      speed_mbps: Math.round(speedMbps * 2) / 2, // Round to 0.5
      timestamp: new Date(),
      latency_ms: Math.round(endTime - startTime)
    };
  } catch (error) {
    return { error: "Test failed" };
  }
}
```

---

## Build Plan (Step-by-Step)

### Phase 1: Core Setup (Day 1)
- [ ] Initialize Vite + React project
- [ ] Create Firestore project + database
- [ ] Set up environment variables (Firebase config)
- [ ] Deploy test file to Vercel or Firebase Storage
- [ ] Basic folder structure + components scaffold

### Phase 2: Speed Test Engine (Day 1)
- [ ] Implement `runSpeedTest()` function
- [ ] Test locally with a known file
- [ ] Verify speed calculation accuracy
- [ ] Handle errors gracefully (timeout, network failure)

### Phase 3: Room Selection UI (Day 2)
- [ ] Build `RoomSelector.tsx` component
- [ ] Add floor/room dropdowns
- [ ] Wire up "Test WiFi" button
- [ ] Add loading/success states

### Phase 4: Database Integration (Day 2)
- [ ] Initialize Firebase in app
- [ ] Write function to save test result to Firestore
- [ ] Verify data appears in Firestore console
- [ ] Add basic error handling

### Phase 5: Leaderboard (Day 3)
- [ ] Build `Leaderboard.tsx` component
- [ ] Real-time listener on `speed_tests` collection
- [ ] Sort by speed descending
- [ ] Display top 3 with medals
- [ ] Format timestamps (e.g., "2 min ago")

### Phase 6: Filters (Day 3)
- [ ] Add `FilterBar.tsx` component
- [ ] Floor filter (6, 7, Both)
- [ ] Speed range slider
- [ ] Recency filter dropdown
- [ ] Apply filters to leaderboard in real-time

### Phase 7: Room History (Day 4)
- [ ] Build history modal component
- [ ] Click room → fetch all tests for that room
- [ ] Calculate average/min/max speed
- [ ] Show trend (optional: simple chart)
- [ ] Display test history list with timestamps

### Phase 8: PWA Setup (Day 4)
- [ ] Create service worker
- [ ] Cache static assets
- [ ] Add manifest.json (app metadata)
- [ ] Install prompt UI
- [ ] Test offline functionality

### Phase 9: Polish & Deploy (Day 5)
- [ ] Mobile responsiveness (Tailwind)
- [ ] Error messages + retry logic
- [ ] Empty state messaging
- [ ] Dark mode toggle (optional)
- [ ] Deploy to Vercel
- [ ] Test on real devices

### Phase 10: Launch & Monitor (Ongoing)
- [ ] Share link with 6th/7th floor students
- [ ] Monitor Firestore usage
- [ ] Watch for bad data (spam tests)
- [ ] Iterate based on feedback

---

## API/Firestore Queries

### Save Test Result
```javascript
// Add document to 'speed_tests' collection
await addDoc(collection(db, 'speed_tests'), {
  room: selectedRoom,
  floor: selectedFloor,
  speed_mbps: testResult.speed,
  latency_ms: testResult.latency,
  timestamp: serverTimestamp(),
  user_id: 'anonymous',
  test_duration_seconds: 8
});
```

### Get Leaderboard (Real-time)
```javascript
// Query all tests, ordered by speed descending, limited to latest test per room
const q = query(
  collection(db, 'speed_tests'),
  orderBy('speed_mbps', 'desc'),
  limit(50)
);

onSnapshot(q, (snapshot) => {
  // Update leaderboard state
});
```

### Filter by Floor
```javascript
const q = query(
  collection(db, 'speed_tests'),
  where('floor', '==', 6),
  orderBy('speed_mbps', 'desc')
);
```

### Get Room History
```javascript
const q = query(
  collection(db, 'speed_tests'),
  where('room', '==', 'Room 601'),
  orderBy('timestamp', 'desc')
);
```

---

## Deployment Checklist

- [ ] Vercel project created + connected to Git
- [ ] Firebase project created + Firestore initialized
- [ ] Firebase config secured in `.env.local`
- [ ] PWA manifest.json configured
- [ ] Test file uploaded to public hosting
- [ ] Service worker tested offline
- [ ] Mobile responsive on all screen sizes
- [ ] Deployed to Vercel
- [ ] Share public link with users
- [ ] Monitor Firestore usage (free tier limits)

---

## Future Enhancements (Post-MVP)

- [ ] Heatmap visualization (Leaflet map overlay)
- [ ] User accounts + persistent history
- [ ] Notifications for new fast spots
- [ ] WiFi recommendations based on location
- [ ] Integration with campus calendar (test during off-peak hours)
- [ ] Room-level statistics (avg speed, consistency)
- [ ] Ranking badges ("Tested 10+ rooms", etc.)

---

## Notes for Claude Code

- Start with Phase 1 (setup + basic structure)
- Use Firebase Firestore for simplicity (no backend server needed)
- Firestore real-time listeners will keep leaderboard live
- Speed test file should be ~10MB for realistic testing (5-15 second test)
- Use Tailwind for mobile-first responsive design
- PWA service worker important for offline access
- Test on actual devices (mobile) to ensure geolocation + WiFi APIs work

---

## Questions to Address During Build

1. **Test File Hosting:** Will you host the 10MB test file on Vercel, or use Firebase Storage?
2. **User Identification:** Anonymous only, or add email/nickname later?
3. **Room List:** Hardcode rooms 601-650 for floor 6, 701-750 for floor 7, or allow freeform input?
4. **Data Validation:** Should we reject tests with unrealistic speeds (< 1 Mbps or > 1000 Mbps)?
5. **Privacy:** Should test results be tied to a user ID for de-duping, or fully anonymous?
