const axios = require('axios');

// Tidal API client
class TidalApiClient {
  constructor() {
    this.clientId = process.env.TIDAL_CLIENT_ID;
    this.clientSecret = process.env.TIDAL_CLIENT_SECRET;
    this.redirectUri = process.env.TIDAL_REDIRECT_URI;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiration = null;
    this.baseUrl = 'https://api.tidal.com/v1';
  }

  // Initialize the authentication URL for users to authorize the app
  getAuthUrl() {
    const scopes = [
      'r_usr', 
      'w_usr', 
      'r_sub', 
      'w_sub'
    ].join(' ');

    return `https://login.tidal.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  }

  // Exchange the authorization code for access token
  async getAccessToken(code) {
    try {
      const response = await axios.post('https://auth.tidal.com/v1/oauth2/token', {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);

      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw error;
    }
  }

  // Refresh the access token when expired
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('https://auth.tidal.com/v1/oauth2/token', {
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token'
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);

      return {
        accessToken: this.accessToken,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      throw error;
    }
  }

  // Check if token needs refreshing
  async ensureValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiration) {
      await this.refreshAccessToken();
    }
    return this.accessToken;
  }

  // Make authenticated API requests
  async apiRequest(endpoint, method = 'GET', data = null) {
    try {
      await this.ensureValidToken();

      const config = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
      throw error;
    }
  }

  // Get user's saved albums (favorites)
  async getUserFavorites() {
    return this.apiRequest('/users/me/favorites/albums');
  }

  // Get user's recently played tracks 
  async getRecentlyPlayed() {
    return this.apiRequest('/users/me/history/tracks');
  }

  // Get album details
  async getAlbumDetails(albumId) {
    return this.apiRequest(`/albums/${albumId}`);
  }

  // Play an album via the API (may require additional TIDAL integration)
  async playAlbum(albumId) {
    try {
      // Try direct playback API call first
      return await this.apiRequest('/playback/play', 'POST', {
        albumId
      });
    } catch (error) {
      // If direct playback fails, fall back to a web player solution
      console.warn('Direct playback failed, consider implementing a web player integration');
      throw new Error('Playback not supported - consider implementing Tidal web player: ' + error.message);
    }
  }
}

module.exports = new TidalApiClient(); 