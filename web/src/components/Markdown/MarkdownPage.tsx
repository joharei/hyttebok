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

export const MarkdownPage: React.FunctionComponent<Props> = ({ tripText, photoDimensions, images }: Props) => {
  return (
    <ReactMarkdown
      components={{
        // eslint-disable-next-line react/display-name
        p: (props) => (
          <Paragraph slideShowImages={images} photoDimensions={photoDimensions}>
            {props.children}
          </Paragraph>
        ),
      }}
    >
      {tripText}
    </ReactMarkdown>
  );
};
