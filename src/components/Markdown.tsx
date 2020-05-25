import ReactMarkdown from 'react-markdown';
import { Paragraph } from './TripPage/Paragraph';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ReactImageGalleryItem } from 'react-image-gallery';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Theme, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

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

  useEffect(() => {
    if (tripText) {
      const matches = tripText.matchAll(
        /\[\[?(?:!)\[([^\][]*\[?[^\][]*]?[^\][]*)]\(([^\s]+?)(\s+(["'])(.*?)\4)?\)]\(([^ ]+?)(?: "(.+)")?\)/g
      );
      const images: ReactImageGalleryItem[] = [];
      for (const match of matches) {
        const [, alt, thumbnail, , , title, original] = match;
        images.push({
          original,
          thumbnail,
          originalAlt: alt,
          thumbnailAlt: alt,
          originalTitle: title,
          thumbnailTitle: title,
          description: title,
          originalClass: classes.original,
          thumbnailClass: classes.thumbnail,
        });
      }
      setImages(images);
    }
  }, [tripText, classes]);

  if (!tripText) {
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

        {[...Array(5)].map((_, i) => (
          <Grid item key={i}>
            <Typography variant="body1">
              <Skeleton width={`${randomIntFromInterval(20, 100)}%`} />
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  }

  // noinspection RequiredAttributes
  return (
    <ReactMarkdown
      source={tripText}
      // eslint-disable-next-line react/display-name
      renderers={{ paragraph: (props) => <Paragraph images={images} {...props} /> }}
    />
  );
};
