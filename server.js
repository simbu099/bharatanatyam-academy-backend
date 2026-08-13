const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 1. Load env vars with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Connect Database
const connectDB = require('./config/db');
connectDB();

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body Parser & CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Natya Bharati Academy API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/performance-requests', require('./routes/performanceRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎭 Natya Bharati Academy Backend API Running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;