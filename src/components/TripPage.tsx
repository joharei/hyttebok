import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useTripText } from '../firebase/useTripText';
import { Skeleton } from '@material-ui/lab';
import { LazyImage } from 'react-lazy-images';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageLink = (props: any) => {
  if (props.children[0]?.type === 'img' && !props.href.includes('MEDIA_URL')) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        <LazyImage
          src={props.children[0].props.src}
          alt="Bilde"
          debounceDurationMs={300}
          placeholder={({ ref }) => (
            <Skeleton
              ref={ref}
              variant="rect"
              height={300}
              width={(3 / 2) * 300}
              style={{ display: 'inline-flex' }}
            />
          )}
          actual={({ imageProps: { alt, ...rest } }) => (
            <img height={300} width="auto" alt={alt} {...rest} />
          )}
          error={() => <Typography>Klarte ikke å laste bildet</Typography>}
        />
      </a>
    );
  }
  return <a {...props}>{props.children}</a>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Paragraph = (props: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (props.children[0]?.props?.children?.[0]?.props?.src) {
    return props.children;
  }
  return <p>{props.children}</p>;
};

export const TripPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { tripText, loading, error } = useTripText(slug);

  if (loading) {
    return <CircularProgress />;
  }
  if (error || !tripText) {
    return <p>Error</p>;
  }

  return (
    <Grid container>
      <Grid md={12} lg={8} xl={6} item>
        <ReactMarkdown
          source={tripText}
          renderers={{ link: ImageLink, paragraph: Paragraph }}
        />
      </Grid>
    </Grid>
  );
};
