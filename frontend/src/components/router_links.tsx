import Button, { ButtonProps } from '@material-ui/core/Button';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import TableRow, { TableRowProps } from '@material-ui/core/TableRow';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface IRouterLinkProps {
  to: string;
  replace?: boolean;
}

export const LinkListItem = (props: ListItemProps & IRouterLinkProps) => (
  <ListItem {...props} component={Link as any}/>
);

export const LinkTableRow = (props: TableRowProps & IRouterLinkProps) => (
  <TableRow {...props} component={Link as any}/>
);

export const LinkButton = (props: ButtonProps & IRouterLinkProps) => (
  <Button {...props} component={Link as any}/>
);