import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Box from '@mui/material/Box';

const Header = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <MusicNoteIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
            Tidal Recent Albums
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            component={Link} 
            to="/" 
            color="inherit" 
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Home
          </Button>
          <Button 
            component={Link} 
            to="/albums" 
            color="inherit" 
            variant={location.pathname === '/albums' ? 'outlined' : 'text'}
          >
            Albums
          </Button>
          <Button 
            href="/auth/tidal" 
            color="secondary" 
            variant="contained"
          >
            Connect Tidal
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 