import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

export const initFirebase = async (): Promise<void> => {
  const config = await fetch('/__/firebase/init.json');
  initializeApp(await config.json());
  const auth = getAuth();
  auth.useDeviceLanguage();
  const firestore = getFirestore();
  if (location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }
  await enableIndexedDbPersistence(firestore).catch(function (err) {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs where open. Offline caching is only supported on one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log("The current browser doesn't support offline caching.");
    }
  });
};
