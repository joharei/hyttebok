import * as React from 'react';
import { useEffect, useState } from 'react';
import { extractUrls, Urls } from '../../utils/extractUrls';
import { PhotosDetails } from '../../utils/photosDetails';
import { MarkdownPage } from './MarkdownPage';
import { LoadingSkeletons } from './LoadingSkeletons';
import { ViewType } from 'react-images';

type Props = {
  tripText?: string;
  tripPhotos?: PhotosDetails;
  loading: boolean;
};

export const Markdown = ({ tripText, tripPhotos, loading }: Props) => {
  const [images, setImages] = useState<ViewType[] | null>(null);
  const [urls, setUrls] = useState<Urls[] | null>(null);

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

  if (!loading && tripText && tripPhotos && images) {
    return <MarkdownPage tripText={tripText} photoDimensions={tripPhotos} images={images} />;
  } else {
    return <LoadingSkeletons />;
  }
};
