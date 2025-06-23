// Importing all the required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//Initializing the app and setting the PORT
const app = express();
const PORT = process.env.PORT || 5000 

//Setting up the middleware
app.use(express.json());
app.use(cors());

// Connecting to MongoDB using Mongoose
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shashank:shashank123@cluster0.mongodb.net/issue-tracker?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    tlsAllowInvalidCertificates: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log('📊 Database:', MONGODB_URI.split('/').pop().split('?')[0]);
}).catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Please check your MongoDB connection string in .env file');
    console.log('🔗 Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
});

//Routing
app.get('/', (req, res) => {
    res.send('Hi from Express Server');
});

const issueroutes = require('./routes/issueRoutes');
app.use('/api/issues', issueroutes);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Static About Us route
app.get('/api/about', (req, res) => {
  res.json({
    title: 'About BBMP Community Issue Reporter',
    description: 'This platform is built for Bangalore citizens to report civic issues directly to BBMP. Our mission is to make Bangalore cleaner, safer, and more efficient by empowering the community to participate in city improvement.',
    bbmp: {
      name: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
      website: 'https://bbmp.gov.in',
      address: 'N.R. Square, Bengaluru, Karnataka 560002',
      contact: '+91-80-22660000',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    highlights: [
      'Transparent issue tracking',
      'Faster resolution by BBMP',
      'Community-driven improvements',
      'For all Bangalore wards'
    ]
  });
});

// Static Contact Us route
app.get('/api/contact', (req, res) => {
  res.json({
    title: 'Contact Us',
    description: 'For any queries, suggestions, or support, reach out to us below.',
    email: 'support@bbmp.gov.in',
    phone: '+91-80-22660000',
    address: 'N.R. Square, Bengaluru, Karnataka 560002',
    timings: 'Mon-Fri 9:00am - 5:00pm',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Issue Tracker API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /api/issues',
      'POST /api/issues',
      'GET /api/auth/login',
      'POST /api/auth/register',
      'GET /api/about',
      'GET /api/contact',
      'GET /health'
    ]
  });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
});