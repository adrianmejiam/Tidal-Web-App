# Tidal Recent Albums Web App

A web application that enhances your Tidal music streaming experience by tracking and sorting your recently played albums.

## Features

- Connect to your Tidal account
- View albums sorted by recently played (missing in the official Tidal app)
- View albums sorted by listen count
- Play albums directly through Tidal
- Track audio quality information

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: SQLite with Sequelize ORM
- **Authentication**: Tidal OAuth

## Prerequisites

- Node.js (v14 or newer)
- npm (v7 or newer)
- A Tidal account with an active subscription
- Tidal Developer account for API credentials

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/tidal-webapp.git
   cd tidal-webapp
   ```

2. Install all dependencies with a single command:
   ```
   npm run install-all
   ```
   
   Or manually install dependencies:
   ```
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with your Tidal API credentials:
   ```
   PORT=3001
   NODE_ENV=development
   TIDAL_CLIENT_ID=your_client_id
   TIDAL_CLIENT_SECRET=your_client_secret
   TIDAL_REDIRECT_URI=http://localhost:3001/auth/callback
   ```

4. Start both the frontend and backend with a single command:
   ```
   npm start
   ```
   
   Or start them separately:
   ```
   # Start the backend server (from server directory)
   npm run dev

   # In a new terminal, start the frontend (from client directory)
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`

## PowerShell Execution Policy

If you're running this on Windows and encounter issues with script execution in PowerShell, you may need to adjust your execution policy:

```powershell
# Run this in an elevated PowerShell prompt
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Deploying to AWS

To deploy to AWS, you can use Elastic Beanstalk or EC2 instance:

1. Build the client for production:
   ```
   npm run build
   ```

2. Update the `.env` file for production:
   ```
   PORT=8080
   NODE_ENV=production
   TIDAL_CLIENT_ID=your_client_id
   TIDAL_CLIENT_SECRET=your_client_secret
   TIDAL_REDIRECT_URI=https://your-domain.com/auth/callback
   ```

3. Deploy to AWS using the Elastic Beanstalk CLI or AWS Console.

## Exposing Over the Web

For local development but accessible from other devices:

1. Use a service like ngrok:
   ```
   npx ngrok http 3001
   ```

2. Update the `TIDAL_REDIRECT_URI` in the `.env` file to use the ngrok URL.

## License

MIT

## Disclaimer

This app is not affiliated with or endorsed by Tidal. It is an independent project that enhances the Tidal experience through its official API. 