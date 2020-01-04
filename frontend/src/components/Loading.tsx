import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  parent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
});

export const Loading = () => {
  const { parent } = useStyles();

  return (
    <div className={parent}>
      <CircularProgress />
    </div>
  );
};
