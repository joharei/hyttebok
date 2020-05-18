import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { useAuth } from './useAuth';
import { auth } from 'firebase';

export const useAccessToken = () => {
  const { user, signIn } = useAuth();
  const [adAccessToken, setAdAccessToken] = useLocalStorage<string | null>('adAccessToken', null);
  const [reauthenticating, setReauthenticating] = useState(false);

  useEffect(() => {
    const reauthenticate = () => {
      setAdAccessToken(null);
      setReauthenticating(true);

      if (!user) {
        signIn();
        throw Error();
      }

      // eslint-disable-next-line @typescript-eslint/camelcase
      const provider = new firebase.auth.OAuthProvider('microsoft.com').setCustomParameters({ login_hint: user.email });
      user
        .reauthenticateWithPopup(provider)
        .then((credentials) => {
          const accessToken = (credentials.credential as auth.OAuthCredential | null)?.accessToken ?? null;

          if (!accessToken) {
            signIn();
            throw Error();
          }

          setAdAccessToken(accessToken);
          return accessToken;
        })
        .catch((e) => console.error(e));
    };

    if (reauthenticating) {
      // hold on...
    } else if (adAccessToken) {
      fetch('https://graph.microsoft.com/v1.0/me/', {
        method: 'GET',
        headers: { authorization: `Bearer ${adAccessToken}` },
      })
        .then((response) => {
          if (!response.ok) {
            console.log('Graph check not ok. Re-authenticating');
            reauthenticate();
          }
        })
        .catch((e) => {
          console.error('Failed checking graph api. Re-authenticating', e);
          reauthenticate();
        });
    } else {
      console.log('No access token. Re-authenticating');
      reauthenticate();
    }
  }, [reauthenticating, adAccessToken, setAdAccessToken, signIn, user]);

  return adAccessToken;
};
