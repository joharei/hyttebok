import { default as React, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { Backdrop, Fade, makeStyles, Modal, Theme } from '@material-ui/core';
import ProgressiveImage from 'react-progressive-graceful-image';
import clsx from 'clsx';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

import 'react-image-gallery/styles/css/image-gallery.css';

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
  gallerySlides: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  fullscreenImage: {
    width: '100%',
    maxHeight: 'calc(100vh - 80px)',
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
  images: ReactImageGalleryItem[];
}

export const Photo = ({ href, src, height, alt, images }: PhotoProps) => {
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
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={open}>
              <ImageGallery
                additionalClass={classes.gallerySlides}
                items={images}
                startIndex={images.findIndex((value) => value.original === href)}
                onClick={() => setOpen(false)}
                lazyLoad
                renderItem={(item) => (
                  <ProgressiveImage src={item.original ?? ''} placeholder={item.thumbnail ?? ''}>
                    {(src: string) => {
                      return <img className={classes.fullscreenImage} alt={alt} src={src} />;
                    }}
                  </ProgressiveImage>
                )}
              />
            </Fade>
          </Modal>
        )}
      </>
    );
  }
  return <a href={href}>{alt && alt.length ? alt : 'Det er noe feil med linken til dette bildet!'}</a>;
};
