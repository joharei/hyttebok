import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { User, getAuth, getRedirectResult, OAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

interface Auth {
  signIn: () => void;
  signOut: () => Promise<void>;
  user: User | null;
  admin: boolean | null;
}

const authContext = createContext<Auth | null>(null);

export const useAuth = ():
  | Auth
  | { signIn: () => undefined; signOut: () => undefined; admin: null; user: User | null } => {
  return (
    useContext(authContext) || {
      signIn: () => undefined,
      signOut: () => undefined,
      user: getAuth().currentUser,
      admin: null,
    }
  );
};

function useProvideAuth(): Auth {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [, setAdAccessToken] = useLocalStorage<string | null>('adAccessToken', null);

  const signIn = () => {
    signInWithRedirect(getAuth(), new OAuthProvider('microsoft.com')).then();
  };

  const signOut = () => {
    return getAuth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  const metadataUnsubscribe = useRef<(() => void) | null>(null);
  useEffect(() => {
    getRedirectResult(getAuth())
      .then((result) => {
        if (result != null) {
          const accessToken = OAuthProvider.credentialFromResult(result)?.accessToken;
          if (accessToken) {
            setAdAccessToken(accessToken);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        signOut().then();
      });
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      // Remove previous listener.
      metadataUnsubscribe.current?.();
      // On user login add new listener.
      if (user) {
        // Check if refresh is required.
        metadataUnsubscribe.current = onSnapshot(doc(getFirestore(), `metadata/${user.uid}`), (snapshot) => {
          if (snapshot.exists()) {
            user.getIdTokenResult().then((value) => {
              // Check if user is admin
              if ((value.claims.admin as never) === true) {
                setUser(user);
                setAdmin(true);
              } else {
                // If not, force refresh the token and check again
                user.getIdTokenResult(true).then((value) => {
                  setUser(user);
                  setAdmin((value.claims.admin as never) === true);
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

export const ProvideAuth: ({ children }: { children: React.ReactElement }) => JSX.Element = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
