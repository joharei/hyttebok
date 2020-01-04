import React, { createContext, useContext, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';

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
      signIn: () => undefined,
      signOut: () => undefined,
      user: firebase.auth().currentUser,
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
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then();
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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        signIn().then();
      }
    });

    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        if (result.user) {
          setUser(result.user);
        }
      })
      .catch(error => {
        console.log(error);
        signOut().then();
      });
  }, []);

  useEffect(() => {
    if (user) {
      user
        .getIdTokenResult()
        .then(value => setAdmin(value.claims.admin === true));
    }
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
