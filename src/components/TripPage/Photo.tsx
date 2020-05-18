import { default as React, useState } from 'react';
import { LazyImage } from 'react-lazy-images';
import { Skeleton } from '@material-ui/lab';
import { Backdrop, makeStyles, Theme, Typography } from '@material-ui/core';

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
}));

interface PhotoProps {
  src: string;
  href: string;
  height: number;
}

export const Photo = ({ href, src, height, ...props }: PhotoProps) => {
  const classes = usePhotoStyles();
  const [open, setOpen] = useState(false);

  if (!href.includes('MEDIA_URL')) {
    return (
      <>
        <a
          href={href}
          onClick={(event) => {
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
            placeholder={({ ref }) => <Skeleton ref={ref} variant="rect" height={height} width={(3 / 2) * height} />}
            actual={({ imageProps: { alt, ...rest } }) => (
              <img className={classes.image} height={height} width="auto" alt={alt} {...rest} />
            )}
            error={() => <Typography>Klarte ikke å laste bildet</Typography>}
          />
        </a>

        {open && (
          <Backdrop className={classes.backdrop} open={open} onClick={() => setOpen(false)}>
            <LazyImage
              src={href}
              alt="Bilde"
              placeholder={({ ref, imageProps: { alt } }) => (
                <img className={classes.fullscreenImage} alt={alt} ref={ref} src={src} />
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
