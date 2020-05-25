import { Client } from '@microsoft/microsoft-graph-client';

const getClient = (accessToken: string) => {
  return Client.init({
    authProvider: async (done) => {
      try {
        done(null, accessToken);
      } catch (e) {
        done(e, null);
      }
    },
  });
};

export interface Photo {
  data: string;
  original: string;
  thumbnail: string;
}

export const getSharingUrls = async (accessToken: string, itemId: string): Promise<Photo> => {
  return getClient(accessToken)
    .api(`/me/drive/items/${itemId}/createLink`)
    .post({ type: 'embed', scope: 'anonymous' })
    .then((result) => {
      const base64Value = btoa(result.link.webUrl).replace(/=$/i, '').replace('/', '_').replace('+', '-');

      return {
        data: `https://api.onedrive.com/v1.0/shares/u!${base64Value}/root?$expand=thumbnails`,
        original: `https://api.onedrive.com/v1.0/shares/u!${base64Value}/root/content`,
        thumbnail: `https://api.onedrive.com/v1.0/shares/u!${base64Value}/root/thumbnails/0/large/content`,
      };
    });
};
