import app, * as firebase from 'firebase';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const provider = new firebase.auth.GoogleAuthProvider();

class Firebase {

  public auth: firebase.auth.Auth;

  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.auth.useDeviceLanguage();
  }

  public doSignInWithGoogle = () => this.auth.signInWithPopup(provider);

  public doSignOut = () => this.auth.signOut();
}

export default Firebase;