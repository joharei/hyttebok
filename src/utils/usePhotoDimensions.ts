import { Urls } from './extractUrls';
import { notEmpty } from './notEmpty';
import React, { useEffect } from 'react';

export type PhotoDimensions = {
  [originalUrl: string]: {
    width: number;
    height: number;
  };
};

export function usePhotoDimensions(urls: Urls[] | null): PhotoDimensions | null {
  const [photoDimensions, setPhotoDimensions] = React.useState<PhotoDimensions | null>(null);

  useEffect(() => {
    if (!urls) {
      return;
    }

    const promises = urls
      .filter(({ original }) => original.includes('/root/content'))
      .map(({ original }) =>
        fetch(original.replace('/content', '?$select=image,file'))
          .then((value) => value.json())
          .then((value) => ({
            url: original,
            height: value.image.height,
            width: value.image.width,
          }))
          .catch(() => null)
      );
    Promise.all(promises)
      .then((value) =>
        value.filter(notEmpty).reduce(
          (previousValue, currentValue) => ({
            ...previousValue,
            [currentValue.url]: {
              width: currentValue.width,
              height: currentValue.height,
            },
          }),
          {}
        )
      )
      .then((value) => setPhotoDimensions(value))
      .catch(() => setPhotoDimensions({}));
  }, [urls]);

  return photoDimensions;
}
