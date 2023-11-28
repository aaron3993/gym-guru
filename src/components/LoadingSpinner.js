import React from 'react';
import { CircularProgress, Container } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
        <CircularProgress color="primary" size={40} thickness={4} />
    </Container>
  );
};

export default LoadingSpinner;