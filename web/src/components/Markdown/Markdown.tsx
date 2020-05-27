import * as React from 'react';
import { useEffect, useState } from 'react';
import { extractUrls, Urls } from '../../utils/extractUrls';
import { usePhotoDimensions } from '../../utils/usePhotoDimensions';
import { MarkdownPage } from './MarkdownPage';
import { LoadingSkeletons } from './LoadingSkeletons';
import { ViewType } from 'react-images';

export const Markdown = ({ tripText, loading }: { tripText?: string; loading: boolean }) => {
  const [images, setImages] = useState<ViewType[] | null>(null);
  const [urls, setUrls] = useState<Urls[] | null>(null);

  const photoDimensions = usePhotoDimensions(urls);

  useEffect(() => {
    if (loading) {
      setUrls(null);
      setImages(null);
    }
  }, [loading, setUrls, setImages]);

  useEffect(() => {
    if (tripText) {
      setUrls(extractUrls(tripText));
    }
  }, [tripText]);

  useEffect(() => {
    if (urls) {
      setImages(
        urls.map(({ original, thumbnail, alt, title }) => ({
          source: {
            regular: original,
            download: original,
            thumbnail,
          },
          caption: [title, alt].filter((value) => value && value.length > 0).join(' - '),
          alt,
        }))
      );
    }
  }, [urls]);

  if (!loading && tripText && photoDimensions && images) {
    return <MarkdownPage tripText={tripText} photoDimensions={photoDimensions} images={images} />;
  } else {
    return <LoadingSkeletons />;
  }
};
