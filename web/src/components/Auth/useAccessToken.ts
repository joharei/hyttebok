import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { useAuth } from './useAuth';
import { OAuthProvider, reauthenticateWithPopup } from 'firebase/auth';

export const useAccessToken = (): string | null => {
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

      const provider = new OAuthProvider('microsoft.com');
      if (user.email != null) {
        provider.setCustomParameters({ login_hint: user.email });
      }
      reauthenticateWithPopup(user, provider)
        .then((credentials) => {
          const accessToken = OAuthProvider.credentialFromResult(credentials)?.accessToken ?? null;

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
