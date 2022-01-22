import { Box, CircularProgress } from '@mui/material';
import React from 'react';

interface Props {
  height?: string | number;
}

export const Loading: React.FunctionComponent<Props> = ({ height }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: height ?? '100vh',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};
