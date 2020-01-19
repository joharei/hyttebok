import {
  Backdrop,
  Grid,
  GridList,
  GridListTile,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import { AnchorHTMLAttributes, ReactElement, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useTripText } from '../firebase/useTripText';
import { LazyImage } from 'react-lazy-images';
import { Skeleton } from '@material-ui/lab';

const useImageStyles = makeStyles((theme: Theme) => ({
  image: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: '100%',
    width: 'auto',
    '-webkit-transform': 'translate(-50%,-50%)',
    '-ms-transform': 'translate(-50%,-50%)',
    transform: 'translate(-50%,-50%)',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  fullscreenImage: {
    height: '90vh',
    width: '90vw',
    objectFit: 'contain',
  },
}));

interface ImageProps {
  src: string;
  href: string;
  height: number;
}

const ImageLink = ({ href, src, height, ...props }: ImageProps) => {
  const classes = useImageStyles();
  const [open, setOpen] = useState(false);

  if (!href.includes('MEDIA_URL')) {
    return (
      <>
        <a
          href={href}
          onClick={event => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <LazyImage
            src={src}
            alt="Bilde"
            observerProps={{
              rootMargin: '500px 0px',
            }}
            placeholder={({ ref }) => (
              <Skeleton
                ref={ref}
                variant="rect"
                height={height}
                width={(3 / 2) * height}
              />
            )}
            actual={({ imageProps: { alt, ...rest } }) => (
              <img
                className={classes.image}
                height={height}
                width="auto"
                alt={alt}
                {...rest}
              />
            )}
            error={() => <Typography>Klarte ikke å laste bildet</Typography>}
          />
        </a>

        {open && (
          <Backdrop
            className={classes.backdrop}
            open={open}
            onClick={() => setOpen(false)}
          >
            <LazyImage
              src={href}
              alt="Bilde"
              placeholder={({ ref, imageProps: { alt } }) => (
                <img
                  className={classes.fullscreenImage}
                  alt={alt}
                  ref={ref}
                  src={src}
                />
              )}
              actual={({ imageProps: { alt, ...rest } }) => (
                <img className={classes.fullscreenImage} alt={alt} {...rest} />
              )}
              error={() => <Typography>Klarte ikke å laste bildet</Typography>}
            />
          </Backdrop>
        )}
      </>
    );
  }
  return (
    <a href={href} {...props}>
      {href}
    </a>
  );
};

interface ParagraphProps {
  children: ReactElement[];
}

const Paragraph = (props: ParagraphProps) => {
  const singleCol = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  if (props.children?.[0]?.props?.children?.[0]?.props?.src) {
    const imageChildren = props.children.filter(
      child => child.props.children?.[0]?.props?.src
    );
    const cellHeight = imageChildren.length > 2 ? 300 : 400;
    return (
      <GridList
        cellHeight={cellHeight}
        cols={singleCol ? 1 : imageChildren.length > 2 ? 3 : 2}
      >
        {imageChildren.map(
          (child: ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
            <GridListTile key={child.props.href}>
              <ImageLink
                href={child.props.href ?? ''}
                src={child.props.children?.[0]?.props?.src}
                height={cellHeight}
              />
            </GridListTile>
          )
        )}
      </GridList>
    );
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
        <ReactMarkdown source={tripText} renderers={{ paragraph: Paragraph }} />
      </Grid>
    </Grid>
  );
};
