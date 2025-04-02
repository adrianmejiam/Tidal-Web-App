require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const tidalApi = require('./tidalApi');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database with Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Define Models
const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: DataTypes.STRING,
  artist: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
  lastListened: DataTypes.DATE,
  listenCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  tidalUrl: DataTypes.STRING,
  audioQuality: DataTypes.STRING
});

// Define User model for storing Tidal tokens
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tidalUserId: DataTypes.STRING,
  accessToken: DataTypes.STRING,
  refreshToken: DataTypes.STRING,
  tokenExpiration: DataTypes.DATE
});

// API Routes

// Authentication routes
app.get('/auth/tidal', (req, res) => {
  const authUrl = tidalApi.getAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokenData = await tidalApi.getAccessToken(code);
    
    // Store token in database (simplistic approach - in production, associate with user session)
    await User.upsert({
      id: 1, // For simplicity, just use a single user for now
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tokenExpiration: new Date(Date.now() + (tokenData.expiresIn * 1000))
    });
    
    // Redirect to the frontend
    res.redirect(`${process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000'}/connected`);
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect(`${process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000'}/error`);
  }
});

// Tidal API proxy routes
app.get('/api/tidal/favorites', async (req, res) => {
  try {
    // Load user tokens from database
    const user = await User.findByPk(1);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated with Tidal' });
    }
    
    // Set tokens in the API client
    tidalApi.accessToken = user.accessToken;
    tidalApi.refreshToken = user.refreshToken;
    tidalApi.tokenExpiration = new Date(user.tokenExpiration).getTime();
    
    // Get favorites
    const favorites = await tidalApi.getUserFavorites();
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching Tidal favorites:', error);
    res.status(500).json({ error: 'Failed to fetch Tidal favorites' });
  }
});

app.get('/api/tidal/recent', async (req, res) => {
  try {
    // Load user tokens from database
    const user = await User.findByPk(1);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated with Tidal' });
    }
    
    // Set tokens in the API client
    tidalApi.accessToken = user.accessToken;
    tidalApi.refreshToken = user.refreshToken;
    tidalApi.tokenExpiration = new Date(user.tokenExpiration).getTime();
    
    // Get recently played
    const recentlyPlayed = await tidalApi.getRecentlyPlayed();
    
    // Extract unique albums from tracks and update our database
    const processedAlbums = new Set();
    
    for (const track of recentlyPlayed.items) {
      const albumId = track.album.id;
      
      if (!processedAlbums.has(albumId)) {
        processedAlbums.add(albumId);
        
        // Check if album exists in our database
        const existingAlbum = await Album.findByPk(albumId);
        
        if (existingAlbum) {
          // Update existing album
          existingAlbum.lastListened = new Date(track.playbackDateTime);
          existingAlbum.listenCount += 1;
          await existingAlbum.save();
        } else {
          // Create new album
          await Album.create({
            id: albumId,
            title: track.album.title,
            artist: track.album.artist.name,
            imageUrl: track.album.cover,
            lastListened: new Date(track.playbackDateTime),
            tidalUrl: `https://tidal.com/browse/album/${albumId}`,
            audioQuality: track.audioQuality
          });
        }
      }
    }
    
    // Return recently played albums from our database
    const albums = await Album.findAll({
      order: [['lastListened', 'DESC']]
    });
    
    res.json(albums);
  } catch (error) {
    console.error('Error fetching Tidal recent albums:', error);
    res.status(500).json({ error: 'Failed to fetch Tidal recent albums' });
  }
});

// Play album via Tidal
app.post('/api/tidal/play/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    
    // Load user tokens from database
    const user = await User.findByPk(1);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated with Tidal' });
    }
    
    // Set tokens in the API client
    tidalApi.accessToken = user.accessToken;
    tidalApi.refreshToken = user.refreshToken;
    tidalApi.tokenExpiration = new Date(user.tokenExpiration).getTime();
    
    // Try to play album (this might not work depending on Tidal API capabilities)
    await tidalApi.playAlbum(albumId);
    
    // Update our database
    const album = await Album.findByPk(albumId);
    if (album) {
      album.lastListened = new Date();
      album.listenCount += 1;
      await album.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error playing album:', error);
    res.status(500).json({ error: 'Failed to play album' });
  }
});

// Get all albums sorted by lastListened (recent first)
app.get('/api/albums/recent', async (req, res) => {
  try {
    const albums = await Album.findAll({
      order: [['lastListened', 'DESC']]
    });
    res.json(albums);
  } catch (error) {
    console.error('Error fetching recent albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Get all albums sorted by listen count (most listened first)
app.get('/api/albums/most-listened', async (req, res) => {
  try {
    const albums = await Album.findAll({
      order: [['listenCount', 'DESC']]
    });
    res.json(albums);
  } catch (error) {
    console.error('Error fetching most listened albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Add or update album 
app.post('/api/albums', async (req, res) => {
  try {
    const { id, title, artist, imageUrl, tidalUrl, audioQuality } = req.body;
    
    // Check if album exists
    const existingAlbum = await Album.findByPk(id);
    
    if (existingAlbum) {
      // Update existing album
      existingAlbum.lastListened = new Date();
      existingAlbum.listenCount += 1;
      await existingAlbum.save();
      res.json(existingAlbum);
    } else {
      // Create new album
      const newAlbum = await Album.create({
        id,
        title,
        artist,
        imageUrl,
        lastListened: new Date(),
        tidalUrl,
        audioQuality
      });
      res.status(201).json(newAlbum);
    }
  } catch (error) {
    console.error('Error adding/updating album:', error);
    res.status(500).json({ error: 'Failed to add/update album' });
  }
});

// Delete album
app.delete('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Album.destroy({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer(); 