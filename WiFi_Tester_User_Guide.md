# WiFi Speed Tester - User Guide

## Getting Started

### 1. Open the App
- Open the WiFi Tester in your browser (bookmark the link or install as PWA)
- **To install on your home screen:**
  - iOS: Tap Share → Add to Home Screen
  - Android: Tap ⋯ (menu) → Install app

### 2. Select Your Location

**Step 1:** Choose your floor from the **Floor** dropdown
- Option: 6th Floor
- Option: 7th Floor

**Step 2:** Choose your room from the **Room** dropdown
- Rooms are listed as "Room 601", "Room 602", etc.
- Or select common areas: "Hallway", "Study Lounge", "Cafe"
- If your exact room isn't listed, type it in the custom input

**Example:**
```
Floor: 6
Room: Room 614
```

---

## Running a WiFi Speed Test

### Press "Test WiFi"
1. Make sure you're connected to the campus WiFi network
2. Tap the blue **"Test WiFi"** button
3. The app will show a progress bar: **"Testing... 25%"**
4. Wait ~10 seconds for the test to complete
5. Your speed appears immediately

### What You'll See
```
Speed: 48.5 Mbps
Latency: 25 ms
Time: 2:45 PM
```

### What This Means
- **Speed (Mbps):** Download speed in Megabits per second
  - **> 50 Mbps** = Excellent (videos, gaming, video calls)
  - **25-50 Mbps** = Good (streaming, browsing, calls)
  - **10-25 Mbps** = Fair (basic browsing, some lag)
  - **< 10 Mbps** = Poor (slow, difficult to use)

- **Latency (ms):** Response time in milliseconds (lower = better)
  - **< 50 ms** = Great
  - **50-100 ms** = Acceptable
  - **> 100 ms** = Noticeable lag

---

## Reading the Leaderboard

The leaderboard shows all tested rooms **ranked from fastest to slowest**.

### Leaderboard Layout
```
🥇 Room 601    52.0 Mbps    Just now
🥈 Room 605    48.5 Mbps    5 min ago
🥉 Room 615    45.2 Mbps    12 min ago
4️⃣  Hallway    38.1 Mbps    25 min ago
   Room 614    8.3 Mbps     2 hours ago ⚠️
```

### Legend
- **🥇 Gold Medal** = Fastest room
- **🥈 Silver Medal** = 2nd fastest
- **🥉 Bronze Medal** = 3rd fastest
- **⚠️ Warning Icon** = Slowest/problematic speed
- **"Just now"** = Test completed seconds ago
- **"5 min ago"** = Test completed 5 minutes ago

### How to Use It
- **Finding good WiFi:** Look for rooms near the top (faster speeds)
- **Avoid slow spots:** Rooms at the bottom have poor connectivity
- **Check timestamp:** Recent tests (5-30 min ago) are most reliable

---

## Viewing Room History

### Click Any Room to See Details
1. Tap on any room in the leaderboard (e.g., "Room 601")
2. A detail panel opens showing:
   - All past tests for that room
   - Average speed
   - Fastest speed
   - Slowest speed
   - Speed trend (🔼 improving, 🔽 declining, ➡️ stable)

### History Example
```
ROOM 601 - History

Average Speed: 48.2 Mbps 🔼 (improving)
Fastest: 52.0 Mbps
Slowest: 44.5 Mbps
Tests: 15 total

Recent Tests:
- 52.0 Mbps   Today 2:45 PM
- 48.5 Mbps   Today 2:25 PM
- 46.1 Mbps   Yesterday 3:10 PM
- 44.5 Mbps   Yesterday 1:45 PM
```

### What This Tells You
- **Trend:** Is WiFi getting better or worse in this room?
- **Consistency:** Does speed vary a lot, or stay stable?
- **Best time:** When was the fastest test? (Time of day patterns)

---

## Using Filters

Filters help you find the information you're looking for.

### Filter 1: By Floor
**Toggle between floors or view both**

- **6th Floor Only** → See just 6th floor results
- **7th Floor Only** → See just 7th floor results
- **Both Floors** → See all results (default)

**Use when:** You only care about your floor

### Filter 2: Speed Range
**Slide to show only rooms above a certain speed**

Example sliders:
- Drag left (0 Mbps) to right (100 Mbps)
- Set minimum: **"Show only rooms > 30 Mbps"**

**Use when:** You want rooms that are definitely fast enough for your task

### Filter 3: Recency
**Choose how fresh you want the data**

- **Last Hour** → Tests from the last 60 minutes (most current)
- **Last Day** → Tests from the last 24 hours
- **All Time** → All tests ever (shows trends but may be outdated)

**Use when:** Checking if conditions have changed recently

### Example Filter Scenario
```
I want to find a FAST room RIGHT NOW on the 6th floor

Settings:
- Floor: 6th Floor Only
- Speed Range: > 40 Mbps
- Recency: Last Hour

Result: Shows only 6th floor rooms with recent tests > 40 Mbps
```

---

## Tips & Best Practices

### For Accurate Tests
✅ **DO:**
- Make sure you're actually connected to the WiFi
- Stand still during the test (moving affects results)
- Test at the location where you plan to work
- Test during the time of day you'll actually use it
- Test multiple times in the same room (WiFi varies)

❌ **DON'T:**
- Test near walls or metal objects (blocks signal)
- Test while downloading other files
- Test from an obstructed corner (signal might improve 10 feet away)
- Assume one test is the full picture (run 2-3 tests)

### Finding the Best Study Spot
1. **Check the leaderboard** for rooms in the top 5
2. **Filter by recency** to see recent tests only
3. **Click a room** to see if speed is consistent
4. **Try it yourself** — run your own test in that room to confirm
5. **Compare nearby rooms** (Room 601 vs 602 vs 603)

### Understanding Speed Variations
- **Time of day:** 8-9 AM and 12-1 PM are busier (slower)
- **Day of week:** Weekdays > weekends (more users)
- **Location:** Corners and edges often have weaker signal
- **Time of semester:** Early semester = fewer tests, less reliable data

---

## Troubleshooting

### "Test Failed" or No Speed Result

**Problem:** Test didn't complete or returned an error

**Solutions:**
1. **Check WiFi connection** — Make sure you're connected to campus WiFi
2. **Try again** — Network hiccups happen; wait 30 sec and retry
3. **Move location** — If in a dead zone, move closer to a wall or window
4. **Restart app** — Close and reopen the PWA
5. **Clear cache** — Go to browser settings > Clear browsing data

### Speed Seems Unrealistically Fast/Slow

**Problem:** Got 200 Mbps or 0.5 Mbps (seems wrong)

**Solutions:**
1. **Is anyone else using the network?** WiFi speed drops with more users
2. **Are you on 5GHz or 2.4GHz?** (You can't always control this)
3. **Run test multiple times** — Average 2-3 tests for a real picture
4. **Check if campus WiFi is down** — Try from a different location

### Room Not in Dropdown

**Problem:** Your exact room isn't listed in the dropdown

**Solutions:**
1. **Select closest room** (e.g., Room 601 if you're in 603)
2. **Use custom input** — Type your room number manually
3. **Use descriptive name** — "Hallway outside 614" or "Study Nook"

### App Won't Load or Is Slow

**Problem:** PWA crashes or takes forever to load

**Solutions:**
1. **Hard refresh** — Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear service worker cache** — Settings > App > Clear cache
3. **Reinstall PWA** — Remove from home screen, reinstall from browser
4. **Check internet** — You need WiFi to upload test results

### Leaderboard Isn't Updating

**Problem:** Still seeing old test results from hours ago

**Solutions:**
1. **Refresh page** — Pull to refresh on mobile, or press F5
2. **Check filters** — Is a filter hiding recent tests?
3. **Wait a bit** — Real-time updates take a few seconds
4. **Check recency filter** — Switch to "Last Hour" to see fresh data

---

## Data Privacy

### What We Collect
- Room/Floor you tested
- Your speed test result (speed in Mbps, latency)
- Timestamp of when you tested
- **NOT:** Your location data (GPS), email, or personal info

### How It's Used
- Displayed in the public leaderboard
- Used to calculate room averages and trends
- Helps other students find good WiFi

### Anonymity
- Tests are completely anonymous
- No user login required
- No personal data tied to your test

---

## FAQs

**Q: Why is my test slow if I see fast speeds in the leaderboard?**
A: Speed varies by time of day and location. Even in the same room, speed can change. Run multiple tests to get an average.

**Q: Can I delete my test result?**
A: Once submitted, results stay public (to maintain data integrity). Only new tests add to the average.

**Q: Why do some rooms have only 1-2 tests while others have 10+?**
A: Popular rooms get more tests. Rooms with fewer tests may be less reliable data.

**Q: Can I see WHO tested each room?**
A: No—all tests are anonymous. You only see speed + timestamp.

**Q: Does testing use my data plan?**
A: No—you're testing the WiFi, not using cellular data. But you need to be connected to WiFi to run a test.

**Q: Why should I test if I don't plan to use it?**
A: Every test helps improve the leaderboard for everyone. Even one test per room gives future students better info.

---

## Contact & Feedback

Found a bug? Have suggestions?

- Report issues: [contact form or email]
- Feature requests: [contact form or email]
- Check for updates: Refresh the app to get the latest version

---

**Happy testing! Find your perfect study spot. 📍📶**
