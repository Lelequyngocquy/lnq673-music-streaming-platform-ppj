require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS middleware
const path = require('path');
const db = require('./models');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Body parsing middleware

// Handle pre-flight requests for CORS
app.options('*', cors()); // Handle pre-flight OPTIONS requests for all routes

// Import routes
const loginRoutes = require('./api/login');
const s3Routes = require('./api/s3');
const uploadRoutes = require('./api/upload');
const albumRoutes = require('./api/album');
const artistRoutes = require('./api/artist');
const userRoutes = require('./api/user');
const userAlbumRoutes = require('./api/user_album')

// Routes
app.use('/api', loginRoutes);
app.use('/api', s3Routes); // Test S3 APIs
app.use('/api', uploadRoutes); // File Upload APIs
app.use('/api', albumRoutes);
app.use('/api', artistRoutes);
app.use('/api', userRoutes);
app.use('/api',userAlbumRoutes)

// Catch-all route for invalid paths
app.use((req, res) => {
  console.error(`[ERROR] Invalid route: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
