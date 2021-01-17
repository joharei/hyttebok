import firebase from 'firebase';

export const initFirebase = async (): Promise<void> => {
  const config = await fetch('/__/firebase/init.json');
  firebase.initializeApp(await config.json());
  firebase.auth().useDeviceLanguage();
  await firebase
    .firestore()
    .enablePersistence()
    .catch(function (err) {
      if (err.code === 'failed-precondition') {
        console.log('Multiple tabs where open. Offline caching is only supported on one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.log("The current browser doesn't support offline caching.");
      }
    });
};

export default firebase;
export const { auth, firestore, storage } = firebase;
