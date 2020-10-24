import { PhotosDetails } from '../../utils/photosDetails';
import ReactMarkdown from 'react-markdown';
import * as React from 'react';
import { Paragraph } from './Paragraph';
import { PhotoDetails } from './Photo';

type Props = {
  tripText: string;
  photoDimensions: PhotosDetails;
  images: PhotoDetails[];
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
