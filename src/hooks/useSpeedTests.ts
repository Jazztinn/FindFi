import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import type { DataStatus, RoomRecord, RoomSelection, SpeedTestRecord, SpeedTestResult } from '../types';

interface FirestoreRoom {
  name: string;
  location: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  last_speed_mbps: number | null;
  average_speed_mbps: number | null;
  test_count: number;
}

interface FirestoreSpeedTest {
  room_id: string;
  room_name: string;
  location: string;
  speed_mbps: number;
  latency_ms: number;
  test_duration_seconds: number;
  timestamp?: Timestamp;
  user_id: 'anonymous';
}

const now = Date.now();

const demoRooms: RoomRecord[] = [
  {
    id: 'room-601',
    name: 'Room 601',
    location: '6th floor, east hallway',
    createdAt: new Date(now - 4 * 60 * 60 * 1000),
    updatedAt: new Date(now - 12 * 60 * 1000),
    lastSpeedMbps: 48.5,
    averageSpeedMbps: 48.5,
    testCount: 1,
  },
  {
    id: 'room-704',
    name: 'Room 704',
    location: '7th floor, study wing',
    createdAt: new Date(now - 5 * 60 * 60 * 1000),
    updatedAt: new Date(now - 45 * 60 * 1000),
    lastSpeedMbps: 31,
    averageSpeedMbps: 31,
    testCount: 1,
  },
  {
    id: 'main-hallway',
    name: 'Main Hallway',
    location: '6th floor near elevators',
    createdAt: new Date(now - 6 * 60 * 60 * 1000),
    updatedAt: new Date(now - 2 * 60 * 60 * 1000),
    lastSpeedMbps: 12.5,
    averageSpeedMbps: 12.5,
    testCount: 1,
  },
];

const demoTests: SpeedTestRecord[] = [
  {
    id: 'demo-601',
    roomId: 'room-601',
    roomName: 'Room 601',
    location: '6th floor, east hallway',
    speedMbps: 48.5,
    latencyMs: 2200,
    durationSeconds: 2.2,
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    userId: 'anonymous',
  },
  {
    id: 'demo-704',
    roomId: 'room-704',
    roomName: 'Room 704',
    location: '7th floor, study wing',
    speedMbps: 31,
    latencyMs: 3100,
    durationSeconds: 3.1,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    userId: 'anonymous',
  },
  {
    id: 'demo-hall',
    roomId: 'main-hallway',
    roomName: 'Main Hallway',
    location: '6th floor near elevators',
    speedMbps: 12.5,
    latencyMs: 4100,
    durationSeconds: 4.1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: 'anonymous',
  },
];

export function useSpeedTests() {
  const db = useMemo(() => getFirebaseDb(), []);
  const [rooms, setRooms] = useState<RoomRecord[]>(db ? [] : demoRooms);
  const [tests, setTests] = useState<SpeedTestRecord[]>(db ? [] : demoTests);
  const [status, setStatus] = useState<DataStatus>(db ? 'loading' : 'env-missing');

  useEffect(() => {
    if (!db) return;

    const roomsQuery = query(collection(db, 'rooms'), orderBy('updated_at', 'desc'));
    const unsubscribeRooms = onSnapshot(
      roomsQuery,
      (snapshot) => {
        setRooms(
          snapshot.docs.map((roomDoc) => {
            const data = roomDoc.data() as FirestoreRoom;
            return {
              id: roomDoc.id,
              name: data.name,
              location: data.location,
              createdAt: data.created_at?.toDate() ?? new Date(),
              updatedAt: data.updated_at?.toDate() ?? new Date(),
              lastSpeedMbps: data.last_speed_mbps,
              averageSpeedMbps: data.average_speed_mbps,
              testCount: data.test_count,
            };
          }),
        );
        setStatus('ready');
      },
      () => setStatus('error'),
    );

    const testsQuery = query(collection(db, 'speed_tests'), orderBy('timestamp', 'desc'));
    const unsubscribeTests = onSnapshot(
      testsQuery,
      (snapshot) => {
        setTests(
          snapshot.docs.map((testDoc) => {
            const data = testDoc.data() as FirestoreSpeedTest;
            return {
              id: testDoc.id,
              roomId: data.room_id,
              roomName: data.room_name,
              location: data.location,
              speedMbps: data.speed_mbps,
              latencyMs: data.latency_ms,
              durationSeconds: data.test_duration_seconds,
              timestamp: data.timestamp?.toDate() ?? new Date(),
              userId: data.user_id,
            };
          }),
        );
        setStatus('ready');
      },
      () => setStatus('error'),
    );

    return () => {
      unsubscribeRooms();
      unsubscribeTests();
    };
  }, [db]);

  async function saveRoomTest(selection: RoomSelection, result: SpeedTestResult) {
    const roomName = selection.room.trim();
    const location = selection.location.trim();
    const roomId = roomKey(roomName);
    const timestamp = new Date();
    const existingRoom = rooms.find((room) => room.id === roomId);
    const testCount = (existingRoom?.testCount ?? 0) + 1;
    const previousAverage = existingRoom?.averageSpeedMbps ?? 0;
    const averageSpeedMbps =
      Math.round(((previousAverage * (testCount - 1) + result.speedMbps) / testCount) * 10) / 10;
    const roomRecord: RoomRecord = {
      id: roomId,
      name: roomName,
      location,
      createdAt: existingRoom?.createdAt ?? timestamp,
      updatedAt: timestamp,
      lastSpeedMbps: result.speedMbps,
      averageSpeedMbps,
      testCount,
    };
    const testRecord: Omit<SpeedTestRecord, 'id'> = {
      roomId,
      roomName,
      location,
      speedMbps: result.speedMbps,
      latencyMs: result.latencyMs,
      durationSeconds: result.durationSeconds,
      timestamp,
      userId: 'anonymous',
    };

    if (!db) {
      setRooms((current) => {
        const withoutRoom = current.filter((room) => room.id !== roomId);
        return [roomRecord, ...withoutRoom];
      });
      setTests((current) => [{ ...testRecord, id: crypto.randomUUID() }, ...current]);
      return;
    }

    await setDoc(
      doc(db, 'rooms', roomId),
      {
        name: roomRecord.name,
        location: roomRecord.location,
        created_at: existingRoom ? existingRoom.createdAt : serverTimestamp(),
        updated_at: serverTimestamp(),
        last_speed_mbps: roomRecord.lastSpeedMbps,
        average_speed_mbps: roomRecord.averageSpeedMbps,
        test_count: roomRecord.testCount,
      },
      { merge: true },
    );

    await addDoc(collection(db, 'speed_tests'), {
      room_id: testRecord.roomId,
      room_name: testRecord.roomName,
      location: testRecord.location,
      speed_mbps: testRecord.speedMbps,
      latency_ms: testRecord.latencyMs,
      timestamp: serverTimestamp(),
      user_id: testRecord.userId,
      test_duration_seconds: testRecord.durationSeconds,
    });
  }

  return { rooms, tests, status, saveRoomTest };
}

function roomKey(roomName: string) {
  return roomName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
