import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Connected = () => {
  const navigate = useNavigate();

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/albums');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Successfully Connected to Tidal
        </Typography>
        <Typography variant="body1" paragraph>
          Your Tidal account has been successfully connected. You can now view your recently played albums.
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          You will be automatically redirected to the albums page in 5 seconds.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            component={Link} 
            to="/albums" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Go to Albums Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Connected; 