import { AnchorHTMLAttributes, default as React, ReactElement } from 'react';
import Gallery, { PhotoProps } from 'react-photo-gallery';
import { PhotosDetails } from '../../utils/photosDetails';
import { Photo } from './Photo';
import { makeStyles } from '@material-ui/core/styles';
import { ViewType } from 'react-images';

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
  children: ReactElement[];
  slideShowImages: ViewType[];
  photoDimensions: PhotosDetails;
}

export const Paragraph = ({ children, slideShowImages, photoDimensions }: ParagraphProps) => {
  const classes = useStyles();

  if (children?.[0]?.props?.children?.[0]?.props?.src) {
    const imageChildren = children.filter((child) => child.props.children?.[0]?.props?.src);

    if (imageChildren.length > 1) {
      const photos: PhotoProps<{ href: string }>[] = imageChildren.map(
        (child: ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>) => ({
          href: child.props.href ?? '',
          src: child.props.children?.[0]?.props?.src,
          alt: child.props.children?.[0]?.props?.alt,
          width: photoDimensions[child.props.href ?? '']?.width ?? 400,
          height: photoDimensions[child.props.href ?? '']?.height ?? 300,
        })
      );

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
      const dimensions = photoDimensions[imageChildren[0].props.href ?? ''] ?? { width: 400, height: 300 };
      const width = (300 / dimensions.height) * dimensions.width;
      return (
        <div className={classes.singlePhotoContainer}>
          <Photo
            href={imageChildren[0].props.href ?? ''}
            src={imageChildren[0].props.children?.[0]?.props?.src}
            alt={imageChildren[0].props.children?.[0]?.props?.alt}
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
