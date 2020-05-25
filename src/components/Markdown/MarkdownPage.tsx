import { PhotoDimensions } from '../../utils/usePhotoDimensions';
import ReactMarkdown from 'react-markdown';
import * as React from 'react';
import { ReactImageGalleryItem } from 'react-image-gallery';
import { Paragraph } from './Paragraph';

type Props = {
  tripText: string;
  photoDimensions: PhotoDimensions;
  images: ReactImageGalleryItem[];
};

export const MarkdownPage = ({ tripText, photoDimensions, images }: Props) => {
  return (
    <ReactMarkdown
      source={tripText}
      renderers={{
        // eslint-disable-next-line react/display-name
        paragraph: (props: { children: React.ReactElement[] }) => (
          <Paragraph slideShowImages={images} photoDimensions={photoDimensions}>
            {props.children}
          </Paragraph>
        ),
      }}
    />
  );
};
