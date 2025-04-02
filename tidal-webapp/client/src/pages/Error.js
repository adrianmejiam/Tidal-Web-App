import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Error = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Connection Error
        </Typography>
        <Typography variant="body1" paragraph>
          There was a problem connecting to your Tidal account. This could be due to:
        </Typography>
        <Box sx={{ textAlign: 'left', mb: 3, mx: 'auto', maxWidth: '400px' }}>
          <Typography component="ul">
            <li>Authentication failed or was canceled</li>
            <li>Your Tidal subscription has expired</li>
            <li>Server-side connection issues</li>
          </Typography>
        </Box>
        <Typography variant="body2" paragraph>
          Please try connecting again. If the problem persists, check your Tidal subscription status.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            component={Link} 
            to="/" 
            variant="contained" 
            color="primary" 
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button 
            href="/auth/tidal" 
            variant="outlined" 
            color="secondary"
          >
            Try Again
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Error; 