require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');

const districtRoutes = require('./routes/district');
const stateRoutes = require('./routes/state');
const locationRoutes = require('./routes/location');
const { syncMGNREGAData } = require('./services/dataSync');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/districts', districtRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/location', locationRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mgnrega', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Initial data sync
  console.log('🔄 Starting initial data sync...');
  syncMGNREGAData().catch(err => console.error('Initial sync error:', err));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Schedule daily data sync at 2 AM
cron.schedule('0 2 * * *', () => {
  console.log('🔄 Running scheduled data sync...');
  syncMGNREGAData().catch(err => console.error('Scheduled sync error:', err));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with retry on EADDRINUSE
function startServer(port, attempts = 0) {
  const maxAttempts = 5;
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempts < maxAttempts) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Trying port ${nextPort} (attempt ${attempts + 1}/${maxAttempts})`);
      setTimeout(() => startServer(nextPort, attempts + 1), 500);
    } else {
      console.error('Failed to start server:', err);
      // Exit process for non-recoverable errors
      process.exit(1);
    }
  });
}

startServer(Number(process.env.PORT) || PORT);

module.exports = app;
