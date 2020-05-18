import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { User } from 'firebase';

interface Auth {
  signIn: () => void;
  signOut: () => Promise<void>;
  user: User | null;
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
  const [, setAdAccessToken] = useLocalStorage<string | null>('adAccessToken', null);

  const signIn = () => {
    firebase
      .auth()
      .signInWithRedirect(new firebase.auth.OAuthProvider('microsoft.com'))
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

  const metadataUnsubscribe = useRef<(() => void) | null>(null);
  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        const accessToken = (result.credential as firebase.auth.OAuthCredential | null)?.accessToken ?? null;
        if (accessToken) {
          console.log('Setting access token from redirect result', accessToken);
          setAdAccessToken(accessToken);
        }
      })
      .catch(error => {
        console.error(error);
        signOut().then();
      });
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      // Remove previous listener.
      metadataUnsubscribe.current?.();
      // On user login add new listener.
      if (user) {
        // Check if refresh is required.
        metadataUnsubscribe.current = firebase
          .firestore()
          .doc(`metadata/${user.uid}`)
          .onSnapshot(snapshot => {
            if (snapshot.exists) {
              user.getIdTokenResult().then(value => {
                // Check if user is admin
                if (value.claims.admin === true) {
                  setUser(user);
                  setAdmin(true);
                } else {
                  // If not, force refresh the token and check again
                  user.getIdTokenResult(true).then(value => {
                    setUser(user);
                    setAdmin(value.claims.admin === true);
                  });
                }
              });
            }
          });
      } else {
        signIn();
      }
    });

    return () => {
      metadataUnsubscribe.current?.();
      unsubscribe();
    };
  }, [setAdAccessToken]);

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
