/* global process */

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
});
firebase.auth().useDeviceLanguage();

interface Auth {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  user: firebase.User | null;
  admin: boolean | null;
}

const authContext = createContext<Auth | null>(null);

export const useAuth = () => {
  return (
    useContext(authContext) || {
      signIn: () => {},
      signOut: () => {},
      user: null,
      admin: null,
    }
  );
};

function useProvideAuth(): Auth {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);

  const signIn = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(response => {
        setUser(response.user);
      });
  };

  const signOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    user &&
      user
        .getIdTokenResult()
        .then(value => setAdmin(value.claims.admin === true));
  }, [user]);

  useEffect(() => {
    if (admin === false) {
      signOut().then(() => {
        setUser(null);
        setAdmin(null);
      });
    }
  }, [admin]);

  return {
    user,
    admin,
    signIn,
    signOut,
  };
}

export const ProvideAuth = ({ children }: { children: React.ReactElement }) => {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
