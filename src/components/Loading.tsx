import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  parent: ({ height }: Props) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height ?? '100vh',
  }),
});

interface Props {
  height?: string | number;
}

export const Loading = (props: Props) => {
  const { parent } = useStyles(props);

  return (
    <div className={parent}>
      <CircularProgress />
    </div>
  );
};
