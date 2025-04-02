import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Album Services
export const getRecentAlbums = () => api.get('/api/albums/recent');
export const getMostListenedAlbums = () => api.get('/api/albums/most-listened');
export const playAlbum = (albumId) => api.post(`/api/tidal/play/${albumId}`);

// Tidal Integration Services
export const getTidalRecentAlbums = () => api.get('/api/tidal/recent');
export const getTidalFavorites = () => api.get('/api/tidal/favorites');

export default api; 