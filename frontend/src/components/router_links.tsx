import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

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
