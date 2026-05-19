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
import { firestoreCollections, firestoreFields } from '../data/firestoreContract';
import { getClientMetadata } from '../lib/clientMetadata';
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
  user_agent?: string;
  connection_effective_type?: string | null;
  connection_downlink_mbps?: number | null;
  connection_rtt_ms?: number | null;
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
    metadata: demoMetadata(),
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
    metadata: demoMetadata(),
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
    metadata: demoMetadata(),
  },
];

const localRoomsKey = 'wifiTester.demo.rooms';
const localTestsKey = 'wifiTester.demo.tests';

export function useSpeedTests() {
  const db = useMemo(() => getFirebaseDb(), []);
  const [rooms, setRooms] = useState<RoomRecord[]>(() => (db ? [] : loadLocalRooms()));
  const [tests, setTests] = useState<SpeedTestRecord[]>(() => (db ? [] : loadLocalTests()));
  const [status, setStatus] = useState<DataStatus>(db ? 'loading' : 'env-missing');

  useEffect(() => {
    if (db) return;
    localStorage.setItem(localRoomsKey, JSON.stringify(rooms));
  }, [db, rooms]);

  useEffect(() => {
    if (db) return;
    localStorage.setItem(localTestsKey, JSON.stringify(tests));
  }, [db, tests]);

  useEffect(() => {
    if (!db) return;

    const roomsQuery = query(
      collection(db, firestoreCollections.rooms),
      orderBy(firestoreFields.room.updatedAt, 'desc'),
    );
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

    const testsQuery = query(
      collection(db, firestoreCollections.speedTests),
      orderBy(firestoreFields.speedTest.timestamp, 'desc'),
    );
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
              metadata: {
                userAgent: data.user_agent ?? '',
                connectionEffectiveType: data.connection_effective_type ?? null,
                connectionDownlinkMbps: data.connection_downlink_mbps ?? null,
                connectionRttMs: data.connection_rtt_ms ?? null,
              },
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
      metadata: getClientMetadata(),
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
      doc(db, firestoreCollections.rooms, roomId),
      {
        [firestoreFields.room.name]: roomRecord.name,
        // Latest user entry wins so map/source text can be corrected in-place.
        [firestoreFields.room.location]: roomRecord.location,
        [firestoreFields.room.createdAt]: existingRoom ? existingRoom.createdAt : serverTimestamp(),
        [firestoreFields.room.updatedAt]: serverTimestamp(),
        [firestoreFields.room.lastSpeedMbps]: roomRecord.lastSpeedMbps,
        [firestoreFields.room.averageSpeedMbps]: roomRecord.averageSpeedMbps,
        [firestoreFields.room.testCount]: roomRecord.testCount,
      },
      { merge: true },
    );

    await addDoc(collection(db, firestoreCollections.speedTests), {
      [firestoreFields.speedTest.roomId]: testRecord.roomId,
      [firestoreFields.speedTest.roomName]: testRecord.roomName,
      [firestoreFields.speedTest.location]: testRecord.location,
      [firestoreFields.speedTest.speedMbps]: testRecord.speedMbps,
      [firestoreFields.speedTest.latencyMs]: testRecord.latencyMs,
      [firestoreFields.speedTest.timestamp]: serverTimestamp(),
      [firestoreFields.speedTest.userId]: testRecord.userId,
      [firestoreFields.speedTest.durationSeconds]: testRecord.durationSeconds,
      [firestoreFields.speedTest.userAgent]: testRecord.metadata.userAgent,
      [firestoreFields.speedTest.connectionEffectiveType]:
        testRecord.metadata.connectionEffectiveType,
      [firestoreFields.speedTest.connectionDownlinkMbps]:
        testRecord.metadata.connectionDownlinkMbps,
      [firestoreFields.speedTest.connectionRttMs]: testRecord.metadata.connectionRttMs,
    });
  }

  function clearLocalDemoData() {
    if (db) return;
    setRooms([]);
    setTests([]);
  }

  return { rooms, tests, status, saveRoomTest, clearLocalDemoData };
}

function demoMetadata() {
  return {
    userAgent: 'Demo browser',
    connectionEffectiveType: null,
    connectionDownlinkMbps: null,
    connectionRttMs: null,
  };
}

function roomKey(roomName: string) {
  const key = roomName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return key || crypto.randomUUID();
}

function loadLocalRooms() {
  const stored = localStorage.getItem(localRoomsKey);
  if (!stored) return demoRooms;

  try {
    return (JSON.parse(stored) as Array<Omit<RoomRecord, 'createdAt' | 'updatedAt'> & {
      createdAt: string;
      updatedAt: string;
    }>).map((room) => ({
      ...room,
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt),
    }));
  } catch {
    return demoRooms;
  }
}

function loadLocalTests() {
  const stored = localStorage.getItem(localTestsKey);
  if (!stored) return demoTests;

  try {
    return (JSON.parse(stored) as Array<Omit<SpeedTestRecord, 'timestamp' | 'metadata'> & {
      timestamp: string;
      metadata?: SpeedTestRecord['metadata'];
    }>).map((test) => ({
      ...test,
      timestamp: new Date(test.timestamp),
      metadata: test.metadata ?? demoMetadata(),
    }));
  } catch {
    return demoTests;
  }
}
