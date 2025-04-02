import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Button, Stack, Alert, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AlbumCard from '../components/AlbumCard';
import { getRecentAlbums, getMostListenedAlbums, getTidalRecentAlbums } from '../services/api';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortMode, setSortMode] = useState('recent');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (sortMode === 'recent') {
        response = await getRecentAlbums();
      } else {
        response = await getMostListenedAlbums();
      }
      
      setAlbums(response.data);
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError('Failed to load albums. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortMode]);

  const refreshFromTidal = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      await getTidalRecentAlbums();
      
      // After updating from Tidal, refresh our local albums list
      await fetchAlbums();
    } catch (err) {
      console.error('Error refreshing from Tidal:', err);
      setError('Failed to refresh from Tidal. Make sure you have connected your account.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleSortChange = (event, newSortMode) => {
    if (newSortMode !== null) {
      setSortMode(newSortMode);
    }
  };

  const handlePlaySuccess = (albumId) => {
    // Update the album's last listened time in our local state
    const updatedAlbums = albums.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          lastListened: new Date(),
          listenCount: album.listenCount + 1
        };
      }
      return album;
    });
    
    // If currently sorted by most recent, re-sort the albums
    if (sortMode === 'recent') {
      updatedAlbums.sort((a, b) => new Date(b.lastListened) - new Date(a.lastListened));
    }
    
    setAlbums(updatedAlbums);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Albums
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', sm: 'center' }} 
          sx={{ my: 3 }}
        >
          <ToggleButtonGroup
            value={sortMode}
            exclusive
            onChange={handleSortChange}
            aria-label="album sort mode"
          >
            <ToggleButton value="recent" aria-label="sorted by recent">
              <AccessTimeIcon sx={{ mr: 1 }} />
              Recently Played
            </ToggleButton>
            <ToggleButton value="count" aria-label="sorted by listen count">
              <RepeatIcon sx={{ mr: 1 }} />
              Most Listened
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<RefreshIcon />}
            onClick={refreshFromTidal}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh from Tidal'}
          </Button>
        </Stack>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : albums.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No albums found. Connect your Tidal account and refresh to see your albums.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {albums.map((album) => (
              <Grid item key={album.id} xs={12} sm={6} md={4} lg={3}>
                <AlbumCard album={album} onPlaySuccess={handlePlaySuccess} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Albums; 