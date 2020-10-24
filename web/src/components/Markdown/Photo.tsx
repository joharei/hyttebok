import { default as React, useRef, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { Backdrop, Fab, Fade, makeStyles, Modal, Theme, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ProgressiveImage from 'react-progressive-graceful-image';
import clsx from 'clsx';

import { PhotosDetails } from '../../utils/photosDetails';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import useFullscreen from '../../utils/useFullscreen';

const usePhotoStyles = makeStyles((theme: Theme) => ({
  carousel: {
    '& .slide': {
      background: 'none',
    },
    '& .carousel-slider': {
      height: '100vh',
    },
  },
  arrowButton: {
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 24px)',
  },
  leftArrowButton: {
    left: theme.spacing(2),
  },
  rightArrowButton: {
    right: theme.spacing(2),
  },

  fullscreenImage: {
    width: '100%',
    height: '100%',
    maxHeight: '100vh',
    objectFit: 'contain',
    userSelect: 'none',
    '-moz-user-select': 'none',
    '-webkit-user-drag': 'none',
    '-webkit-user-select': 'none',
    '-ms-user-select': 'none',
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

export interface PhotoDetails {
  src: string;
  placeholder: string;
  caption?: string;
  alt?: string;
}

interface PhotoProps {
  src: string | undefined;
  href: string;
  alt: string | undefined;
  width: number;
  height: number;
  margin?: string;
  images: PhotoDetails[];
  photoDimensions: PhotosDetails;
}

const View = (props: { photo: PhotoDetails; photoDimensions: PhotosDetails }) => {
  const classes = usePhotoStyles();
  const { photo, photoDimensions } = props;

  return (
    <div>
      <ProgressiveImage src={photo.src} placeholder={photo.placeholder}>
        {(src: string) => {
          return (
            <img
              className={classes.fullscreenImage}
              alt={photo.alt}
              src={src}
              width={photoDimensions[photo.src]?.width ?? 400}
              height={photoDimensions[photo.src]?.height ?? 300}
            />
          );
        }}
      </ProgressiveImage>
      {photo.caption && <Typography className="legend">{photo.caption}</Typography>}
    </div>
  );
};

export const Photo = ({ href, src, width, height, margin, alt, images, photoDimensions }: PhotoProps) => {
  const classes = usePhotoStyles();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [, setFullscreen] = useFullscreen(ref);

  if (src && !href.includes('MEDIA_URL')) {
    return (
      <>
        <a
          href={href}
          onClick={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
          style={{
            width,
            height,
            margin,
          }}
        >
          <ProgressiveImage src={src} placeholder="">
            {(src: string, loading: boolean) => {
              return loading ? (
                <Skeleton variant="rect" height={height} width={width} />
              ) : (
                <img
                  src={src}
                  alt={alt}
                  className={clsx(classes.animated, classes.fadeIn)}
                  height={height}
                  width={width}
                />
              );
            }}
          </ProgressiveImage>
        </a>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div ref={ref} onDoubleClick={() => setFullscreen()}>
              <Carousel
                className={classes.carousel}
                useKeyboardArrows
                dynamicHeight
                showThumbs={false}
                selectedItem={images.findIndex((value) => value.src === href)}
                renderArrowNext={(clickHandler, hasNext, label) => (
                  <Fab
                    className={clsx(classes.arrowButton, classes.rightArrowButton)}
                    onClick={clickHandler}
                    disabled={!hasNext}
                    aria-label={label}
                  >
                    <ArrowForwardIcon />
                  </Fab>
                )}
                renderArrowPrev={(clickHandler, hasPrev, label) => (
                  <Fab
                    className={clsx(classes.arrowButton, classes.leftArrowButton)}
                    onClick={clickHandler}
                    disabled={!hasPrev}
                    aria-label={label}
                  >
                    <ArrowBackIcon />
                  </Fab>
                )}
              >
                {images.map((image) => (
                  <View key={image.src} photo={image} photoDimensions={photoDimensions} />
                ))}
              </Carousel>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }
  return <a href={href}>{alt && alt.length ? alt : 'Det er noe feil med linken til dette bildet!'}</a>;
};
