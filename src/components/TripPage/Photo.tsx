import { default as React, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { Backdrop, makeStyles, Theme } from '@material-ui/core';
import ProgressiveImage from 'react-progressive-graceful-image';
import clsx from 'clsx';

const usePhotoStyles = makeStyles((theme: Theme) => ({
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

  animated: {
    'animation-duration': '0.4s',
    'animation-fill-mode': 'both',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  fadeIn: {
    'animation-name': '$fadeIn',
  },
}));

interface PhotoProps {
  src: string | undefined;
  href: string;
  alt: string | undefined;
  height: number;
}

export const Photo = ({ href, src, height, alt }: PhotoProps) => {
  const classes = usePhotoStyles();
  const [open, setOpen] = useState(false);

  if (src && !href.includes('MEDIA_URL')) {
    return (
      <>
        <a
          href={href}
          onClick={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <ProgressiveImage src={src} placeholder="">
            {(src: string, loading: boolean) => {
              return loading ? (
                <Skeleton variant="rect" height={height} width={(3 / 2) * height} />
              ) : (
                <img
                  src={src}
                  alt={alt}
                  className={clsx(classes.image, classes.animated, classes.fadeIn)}
                  height={height}
                />
              );
            }}
          </ProgressiveImage>
        </a>

        {open && (
          <Backdrop className={classes.backdrop} open={open} onClick={() => setOpen(false)}>
            <ProgressiveImage src={href} placeholder={src}>
              {(src: string) => {
                return <img className={classes.fullscreenImage} alt={alt} src={src} />;
              }}
            </ProgressiveImage>
          </Backdrop>
        )}
      </>
    );
  }
  return <a href={href}>{alt && alt.length ? alt : 'Det er noe feil med linken til dette bildet!'}</a>;
};
