import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import User from './models/User.js';

// Route Imports
import courseRoutes from './routes/courseRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy' });
});

// Seed Initial Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'gsilambarasan54@gmail.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      await User.create({
        name: 'Academy Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`👑 Default Admin Created: ${adminEmail} / ${adminPassword}`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedAdmin();
  app.listen(PORT, () => {
    console.log(`🎭 Natya Bharati Academy Backend API Running on http://localhost:${PORT}`);
  });
});