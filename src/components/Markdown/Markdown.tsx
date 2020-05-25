import * as React from 'react';
import { useEffect, useState } from 'react';
import { ReactImageGalleryItem } from 'react-image-gallery';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { extractUrls, Urls } from '../../utils/extractUrls';
import { usePhotoDimensions } from '../../utils/usePhotoDimensions';
import { MarkdownPage } from './MarkdownPage';
import { LoadingSkeletons } from './LoadingSkeletons';

const useStyles = makeStyles((theme: Theme) => ({
  original: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 80px - ${theme.spacing(4)}px)`,
  },
  thumbnail: {
    '& img': {
      height: '80px',
      objectFit: 'contain',
    },
  },
}));

export const Markdown = ({ tripText, loading }: { tripText?: string; loading: boolean }) => {
  const classes = useStyles();
  const [images, setImages] = useState<ReactImageGalleryItem[] | null>(null);
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
          original,
          thumbnail,
          originalAlt: alt,
          thumbnailAlt: alt,
          originalTitle: title,
          thumbnailTitle: title,
          description: title,
          originalClass: classes.original,
          thumbnailClass: classes.thumbnail,
        }))
      );
    }
  }, [urls, classes]);

  if (!loading && tripText && photoDimensions && images) {
    return <MarkdownPage tripText={tripText} photoDimensions={photoDimensions} images={images} />;
  } else {
    return <LoadingSkeletons />;
  }
};
