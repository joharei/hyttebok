import { Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { useRef } from 'react';

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const LoadingSkeletons: React.FunctionComponent = () => {
  const skeletonWidths = useRef<number[]>([]);
  if (skeletonWidths.current.length === 0) {
    skeletonWidths.current = [...Array(5)].map(() => randomIntFromInterval(20, 100));
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h1">
          <Skeleton width={300} />
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="body1" style={{ marginBottom: 32 }}>
          <Skeleton width="50%" />
        </Typography>
      </Grid>

      <Grid item container spacing={2} style={{ marginBottom: 32 }}>
        <Grid item xs={4}>
          <Skeleton variant="rect" height={300} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rect" height={300} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rect" height={300} />
        </Grid>
      </Grid>

      {skeletonWidths.current.map((width, i) => (
        <Grid item key={i}>
          <Typography variant="body1">
            <Skeleton width={`${width}%`} />
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
