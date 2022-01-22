import { default as React, useRef, useState } from 'react';
import { Backdrop, Fab, Fade, keyframes, Modal, Skeleton, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProgressiveImage from 'react-progressive-graceful-image';

import { PhotosDetails } from '../../utils/photosDetails';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import useFullscreen from '../../utils/useFullscreen';
import { styled } from '@mui/material/styles';

const StyledCarousel = styled(Carousel)``;

const Img = styled('img')``;

const fadeIn = keyframes`
  from: {
    opacity: 0,
  }
  to: {
    opacity: 1,
  }
`;

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
  const { photo, photoDimensions } = props;

  return (
    <div>
      <ProgressiveImage src={photo.src} placeholder={photo.placeholder}>
        {(src: string) => {
          return (
            <Img
              sx={{
                width: '100%',
                height: '100%',
                maxHeight: '100vh',
                objectFit: 'contain',
                userSelect: 'none',
                '-moz-user-select': 'none',
                '-webkit-user-drag': 'none',
                '-webkit-user-select': 'none',
                '-ms-user-select': 'none',
              }}
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

export const Photo: React.FunctionComponent<PhotoProps> = ({
  href,
  src,
  width,
  height,
  margin,
  alt,
  images,
  photoDimensions,
}: PhotoProps) => {
  const theme = useTheme();
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
                <Skeleton variant="rectangular" height={height} width={width} />
              ) : (
                <Img
                  sx={{
                    animation: `${fadeIn} 0.4s both`,
                  }}
                  src={src}
                  alt={alt}
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
              <StyledCarousel
                sx={{
                  '& .slide': {
                    background: 'none',
                  },
                  '& .carousel-slider': {
                    height: '100vh',
                  },
                }}
                useKeyboardArrows
                dynamicHeight
                showThumbs={false}
                selectedItem={images.findIndex((value) => value.src === href)}
                renderArrowNext={(clickHandler, hasNext, label) => (
                  <Fab
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      top: 'calc(50% - 24px)',
                      right: theme.spacing(2),
                    }}
                    onClick={clickHandler}
                    disabled={!hasNext}
                    aria-label={label}
                  >
                    <ArrowForwardIcon />
                  </Fab>
                )}
                renderArrowPrev={(clickHandler, hasPrev, label) => (
                  <Fab
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      top: 'calc(50% - 24px)',
                      left: theme.spacing(2),
                    }}
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
              </StyledCarousel>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }
  return <a href={href}>{alt && alt.length ? alt : 'Det er noe feil med linken til dette bildet!'}</a>;
};
