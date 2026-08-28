import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Database & Middleware Imports
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import User from './models/User.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// ES Module __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// 2. Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Policy
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'Natya Bharati Academy API',
    timestamp: new Date().toISOString(),
  });
});

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/performance-requests', performanceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/stats', statsRoutes);

// 4. Seed Initial Admin User
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'gsilambarasan54@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Academy Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`👑 Default Admin Created: ${adminEmail} / ${adminPassword}`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

// 5. 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// 6. Global Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB & Start Server
connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`🎭 Natya Bharati Academy Backend API Running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
});

export default app;