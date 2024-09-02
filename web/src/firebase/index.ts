import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

export const initFirebase = async (): Promise<void> => {
  const config = await (await fetch('/__/firebase/init.json')).json();
  config['authDomain'] = 'hyttebok.reitan.app';
  initializeApp(config);
  const auth = getAuth();
  auth.useDeviceLanguage();
  const firestore = getFirestore();
  if (location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  }
  await enableIndexedDbPersistence(firestore).catch(function (err) {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs where open. Offline caching is only supported on one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log("The current browser doesn't support offline caching.");
    }
  });
};
