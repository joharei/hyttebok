import ReactMarkdown from 'react-markdown';
import { Paragraph } from './TripPage/Paragraph';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ReactImageGalleryItem } from 'react-image-gallery';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Theme, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { extractUrls, Urls } from '../utils/extractUrls';
import { usePhotoDimensions } from '../utils/usePhotoDimensions';

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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

export const Markdown = ({ tripText }: { tripText?: string }) => {
  const classes = useStyles();
  const [images, setImages] = useState<ReactImageGalleryItem[]>([]);
  const [urls, setUrls] = useState<Urls[] | null>(null);

  const skeletonWidths = useRef<number[]>([]);
  if (skeletonWidths.current.length === 0) {
    skeletonWidths.current = [...Array(5)].map(() => randomIntFromInterval(20, 100));
  }

  const photoDimensions = usePhotoDimensions(urls);

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

  if (!tripText || !photoDimensions) {
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h1">
            <Skeleton width={300} />
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body1" style={{ marginBottom: 32 }}>
            <Skeleton width="50%" />
          </Typography>
        </Grid>

        <Grid item container spacing={2} style={{ marginBottom: 32 }}>
          <Grid item xs={4}>
            <Skeleton variant="rect" height={300} />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="rect" height={300} />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="rect" height={300} />
          </Grid>
        </Grid>

        {skeletonWidths.current.map((width, i) => (
          <Grid item key={i}>
            <Typography variant="body1">
              <Skeleton width={`${width}%`} />
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <ReactMarkdown
      source={tripText}
      renderers={{
        // eslint-disable-next-line react/display-name
        paragraph: (props: { children: React.ReactElement[] }) => (
          <Paragraph slideShowImages={images} photoDimensions={photoDimensions}>
            {props.children}
          </Paragraph>
        ),
      }}
    />
  );
};
