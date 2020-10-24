import { GraphFileBrowser } from '@microsoft/file-browser';
import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { useAccessToken } from '../Auth/useAccessToken';
import { getSharingUrls, Photo } from '../../msgraph/client';
import { Loading } from '../Loading';

interface Props {
  onSuccess: (photos: Photo[]) => void;
  onCancel: () => void;
}

export const OneDrivePhotoPicker: React.FunctionComponent<Props> = ({ onSuccess, onCancel }: Props) => {
  const accessToken = useAccessToken();
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open fullWidth maxWidth="lg">
      <DialogContent>
        {!loading && accessToken && (
          <GraphFileBrowser
            getAuthenticationToken={async () => accessToken}
            itemMode="files"
            selectionMode="multiple"
            onSuccess={(keys) => {
              setLoading(true);
              const urlPromises = keys.map((key) => getSharingUrls(accessToken, Object.values(key)[0][2]));
              Promise.all(urlPromises)
                .then((result) => onSuccess(result))
                .catch((e) => {
                  console.error('Error getting photo urls', e);
                  onCancel();
                })
                .finally(() => setLoading(false));
            }}
            onCancel={onCancel}
          />
        )}

        {(loading || !accessToken) && <Loading height={500} />}
      </DialogContent>
    </Dialog>
  );
};
