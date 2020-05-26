import { default as React, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import ProgressiveImage from 'react-progressive-graceful-image';
import clsx from 'clsx';

import Carousel, { CommonProps, Modal, ModalGateway, ViewType } from 'react-images';
import { PhotoDimensions } from '../../utils/usePhotoDimensions';

const usePhotoStyles = makeStyles((theme: Theme) => ({
  gallerySlides: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  fullscreenImage: {
    width: '100%',
    maxHeight: 'calc(100vh - 80px)',
    // maxHeight: '100vh',
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
  width: number;
  height: number;
  margin?: string;
  images: ViewType[];
  photoDimensions: PhotoDimensions;
}

const View = (props: CommonProps & { photoDimensions: PhotoDimensions }) => {
  const classes = usePhotoStyles();
  const { data, photoDimensions } = props as {
    data: { source: { regular: string; thumbnail: string }; alt: string };
    photoDimensions: PhotoDimensions;
  };

  return (
    <ProgressiveImage src={data.source.regular ?? ''} placeholder={data.source.thumbnail ?? ''}>
      {(src: string) => {
        return (
          <img
            className={classes.fullscreenImage}
            alt={data.alt}
            src={src}
            width={photoDimensions[data.source.regular]?.width ?? 400}
            height={photoDimensions[data.source.regular]?.height ?? 300}
          />
        );
      }}
    </ProgressiveImage>
  );
};

export const Photo = ({ href, src, width, height, margin, alt, images, photoDimensions }: PhotoProps) => {
  const classes = usePhotoStyles();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

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

        <ModalGateway>
          {open && (
            <Modal
              onClose={() => setOpen(false)}
              styles={{
                blanket: (base) => ({ ...base, zIndex: theme.zIndex.drawer + 10 }),
                positioner: (base) => ({ ...base, zIndex: theme.zIndex.modal }),
              }}
            >
              <Carousel
                views={images}
                currentIndex={images.findIndex(
                  (value) => typeof value.source !== 'string' && value.source.regular === href
                )}
                // eslint-disable-next-line react/display-name
                components={{ View: (props) => <View photoDimensions={photoDimensions} {...props} /> }}
              />
            </Modal>
          )}
        </ModalGateway>
      </>
    );
  }
  return <a href={href}>{alt && alt.length ? alt : 'Det er noe feil med linken til dette bildet!'}</a>;
};
