import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Chip, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import HdIcon from '@mui/icons-material/Hd';
import axios from 'axios';

const AlbumCard = ({ album, onPlaySuccess }) => {
  const { id, title, artist, imageUrl, lastListened, listenCount, tidalUrl, audioQuality } = album;

  const formattedDate = lastListened ? new Date(lastListened).toLocaleString() : 'Unknown';
  
  const handlePlay = async () => {
    try {
      await axios.post(`/api/tidal/play/${id}`);
      if (onPlaySuccess) {
        onPlaySuccess(id);
      }
    } catch (error) {
      console.error('Error playing album:', error);
      // Fallback to opening Tidal
      window.open(tidalUrl, '_blank');
    }
  };

  const getQualityIcon = () => {
    if (!audioQuality) return null;
    
    const quality = audioQuality.toLowerCase();
    if (quality.includes('hifi') || quality.includes('master')) {
      return (
        <Chip 
          icon={<HdIcon />} 
          label={audioQuality} 
          size="small" 
          color="secondary" 
          variant="outlined"
        />
      );
    }
    return <Chip label={audioQuality} size="small" variant="outlined" />;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl || 'https://via.placeholder.com/300'}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {artist}
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <RepeatIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Listened {listenCount} {listenCount === 1 ? 'time' : 'times'}
          </Typography>
        </Stack>

        {getQualityIcon() && (
          <Stack direction="row" spacing={1} mt={1}>
            {getQualityIcon()}
          </Stack>
        )}
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          startIcon={<PlayArrowIcon />}
          onClick={handlePlay}
          fullWidth
          variant="contained"
        >
          Play in Tidal
        </Button>
      </CardActions>
    </Card>
  );
};

export default AlbumCard; 