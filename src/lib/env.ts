const firebaseKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export function hasFirebaseEnv() {
  return firebaseKeys.every((key) => Boolean(import.meta.env[key]));
}

export function getSpeedTestFileUrl() {
  return import.meta.env.VITE_SPEED_TEST_FILE_URL || '/speed-test-placeholder.txt';
}
