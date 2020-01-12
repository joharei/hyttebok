import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
      .then(() => {
        console.log('Logged in successfully');
      })
      .catch(() => {
        console.error('Failed to log in');
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

  const metadataUnsubscribe = useRef<(() => void) | null>(null);
  useEffect(() => {
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
      }
    });

    return () => {
      metadataUnsubscribe.current?.();
      unsubscribe();
    };
  }, []);

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
