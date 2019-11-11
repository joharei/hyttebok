import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { TableRowProps } from '@material-ui/core/TableRow';
import { TableRow } from '@material-ui/core';

// The use of React.forwardRef will no longer be required for react-router-dom v6.
// See https://github.com/ReactTraining/react-router/issues/6056
export const ReactRouterLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, 'innerRef'>
>((props, ref) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <Link innerRef={ref as any} {...props} />
));
ReactRouterLink.displayName = 'ReactRouterLink';

export const LinkTableRow = (props: TableRowProps & { to: string }) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TableRow {...props} component={ReactRouterLink as any} />
);
