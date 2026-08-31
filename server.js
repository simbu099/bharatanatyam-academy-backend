import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

// Database & Middleware Imports
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import User from './models/User.js';
import { apiLimiter } from './middleware/rateLimiters.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import subscribeRoutes from './routes/subscribeRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

// ES Module __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Fail fast if critical secrets are missing
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('   Copy backend/.env.example to backend/.env and fill in real values.');
  process.exit(1);
}

const app = express();

// Trust proxy for Render/Vercel rate-limiting
app.set('trust proxy', 1);

// 2. Helmet Configuration (Configured for Cross-Origin requests)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

// Dynamic Allowed Origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://bharatanatyam-academy-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Check exact matches or subdomains on vercel.app
    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

// Apply CORS & Handle Preflight (OPTIONS) requests explicitly
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // Strips $/. operators (NoSQL injection defense)

// Apply Rate Limiter to API routes
app.use('/api', apiLimiter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'Jothi Classical Dancing Academy API',
    timestamp: new Date().toISOString(),
  });
});

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/performance-requests', performanceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/content', contentRoutes);

// 4. Seed Initial Admin User
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping automatic admin seeding.');
      return;
    }

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`👑 Default Admin Created: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// 6. Global Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB & Start Server
connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`🎭 Jothi Classical Dancing Academy Backend API Running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
});

export default app;