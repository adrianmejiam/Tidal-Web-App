import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, Stack } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <MusicNoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Tidal Recent Albums
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Track and sort your recently played albums from Tidal
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          What does this app do?
        </Typography>
        <Typography paragraph>
          Tidal Recent Albums helps you keep track of your listening habits by:
        </Typography>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>Showing your albums sorted by recently played</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RepeatIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>Keeping count of how many times you've listened to each album</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MusicNoteIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>Integration with Tidal to play your albums directly</Typography>
          </Box>
        </Stack>
        <Typography>
          This app is designed to address a missing feature in Tidal - the ability to sort albums by recently played.
        </Typography>
      </Paper>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Ready to get started?
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button component={Link} to="/albums" variant="contained" color="primary" size="large">
            View Albums
          </Button>
          <Button href="/auth/tidal" variant="outlined" color="secondary" size="large">
            Connect Tidal
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home; 