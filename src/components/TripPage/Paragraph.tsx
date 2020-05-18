import { AnchorHTMLAttributes, default as React, ReactElement } from 'react';
import { GridList, GridListTile, Theme, useMediaQuery } from '@material-ui/core';
import { Photo } from './Photo';

interface ParagraphProps {
  children: ReactElement[];
}

export const Paragraph = (props: ParagraphProps) => {
  const singleCol = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (props.children?.[0]?.props?.children?.[0]?.props?.src) {
    const imageChildren = props.children.filter((child) => child.props.children?.[0]?.props?.src);
    const cellHeight = imageChildren.length > 2 ? 300 : 400;
    return (
      <GridList
        cellHeight={cellHeight}
        cols={singleCol ? 1 : imageChildren.length > 2 ? 3 : 2}
        style={{ maxWidth: '100%' }}
      >
        {imageChildren.map((child: ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
          <GridListTile key={child.props.href}>
            <Photo href={child.props.href ?? ''} src={child.props.children?.[0]?.props?.src} height={cellHeight} />
          </GridListTile>
        ))}
      </GridList>
    );
  }
  return <p>{props.children}</p>;
};
