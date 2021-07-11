import { default as React, ReactNode } from 'react';
import Gallery, { PhotoProps } from 'react-photo-gallery';
import { PhotosDetails } from '../../utils/photosDetails';
import { Photo, PhotoDetails } from './Photo';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  singlePhotoContainer: {
    display: 'flex',
    justifyContent: 'center',
    '& img': {
      objectFit: 'scale-down',
      maxWidth: '100%',
    },
  },
});

interface ParagraphProps {
  children: ReactNode[];
  slideShowImages: PhotoDetails[];
  photoDimensions: PhotosDetails;
}

export const Paragraph: React.FunctionComponent<ParagraphProps> = ({
  children,
  slideShowImages,
  photoDimensions,
}: ParagraphProps) => {
  const classes = useStyles();

  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];

  if (typeof firstChild === 'object' && 'props' in firstChild && firstChild?.props?.children?.[0]?.props?.src) {
    const imageChildrenProps = childrenArray.flatMap((child) =>
      typeof child === 'object' && 'props' in child && child.props.children?.[0]?.props?.src ? [child.props] : []
    );

    if (imageChildrenProps.length > 1) {
      const photos: PhotoProps<{ href: string }>[] = imageChildrenProps.map((props) => ({
        href: props.href ?? '',
        src: props.children?.[0]?.props?.src,
        alt: props.children?.[0]?.props?.alt,
        width: photoDimensions[props.href ?? '']?.width ?? 400,
        height: photoDimensions[props.href ?? '']?.height ?? 300,
      }));

      return (
        <Gallery
          photos={photos}
          renderImage={({ photo, margin }) => (
            <Photo
              key={photo.src}
              src={photo.src}
              href={(photo as PhotoProps<{ href: string }>).href}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              margin={margin}
              images={slideShowImages}
              photoDimensions={photoDimensions}
            />
          )}
        />
      );
    } else {
      const dimensions = photoDimensions[imageChildrenProps[0].href ?? ''] ?? { width: 400, height: 300 };
      const width = (300 / dimensions.height) * dimensions.width;
      return (
        <div className={classes.singlePhotoContainer}>
          <Photo
            href={imageChildrenProps[0].href ?? ''}
            src={imageChildrenProps[0].children?.[0]?.props?.src}
            alt={imageChildrenProps[0].children?.[0]?.props?.alt}
            width={width}
            height={300}
            images={slideShowImages}
            photoDimensions={photoDimensions}
          />
        </div>
      );
    }
  }
  return <p>{children}</p>;
};
