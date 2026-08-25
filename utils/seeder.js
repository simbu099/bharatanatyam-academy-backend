import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Course from '../models/Course.js';
import Review from '../models/Review.js';
import Gallery from '../models/Gallery.js';

// Resolve __dirname in ES Modules and explicitly point to backend/.env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env file! Please check backend/.env file location.");
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected for Seeding...');
    }

    // Clear existing collections
    await User.deleteMany({ role: 'admin' });
    await Course.deleteMany({});
    await Review.deleteMany({});
    await Gallery.deleteMany({});

    // 1. Seed Admin User & Guru Profile
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);

    await User.create({
      username: 'admin',
      name: 'Guru Smt. Rukmini Viswanathan',
      email: 'gsilambarasan54@gmail.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 98400 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    });

    // 2. Seed All Courses
    await Course.insertMany([
      {
        title: 'Prarambhik (Beginner Level)',
        category: 'Prarambhik (Beginner)',
        description: 'Introduction to basic Adavus, Talam structures, Hastas (hand gestures), and fundamental body postures in Kalakshetra style.',
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800',
        duration: '12 Months',
        schedule: 'Mon & Wed (07:00 AM - 08:30 AM)',
        fee: 3500,
        level: 'Beginner',
        slotsAvailable: 10
      },
      {
        title: 'Madhyama (Intermediate Level)',
        category: 'Madhyama (Intermediate)',
        description: 'Focus on Varnam items, intricate Jathis, footwork precision, and basic Abhinaya (expressive storytelling).',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
        duration: '24 Months',
        schedule: 'Tue & Thu (05:30 PM - 07:00 PM)',
        fee: 4500,
        level: 'Intermediate',
        slotsAvailable: 8
      },
      {
        title: 'Uttama (Advanced Arangetram Track)',
        category: 'Uttama (Advanced)',
        description: 'Full Margam repertoire preparation, solo Arangetram choreography, stage presence, and live orchestra alignment.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
        duration: '36 Months',
        schedule: 'Flexible Private Sessions',
        fee: 6500,
        level: 'Advanced',
        slotsAvailable: 3
      },
      {
        title: 'Nattuvangam & Rhythm Mastery',
        category: 'Nattuvangam & Rhythm',
        description: 'Mastery of Cymbals (Talam), Solkattu recite training, Jathi structure composition, and orchestra direction for live dance performances.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
        duration: '6 Months',
        schedule: 'Fri & Sat (06:00 PM - 07:30 PM)',
        fee: 5000,
        level: 'Intermediate/Advanced',
        slotsAvailable: 6
      }
    ]);

    // 3. Seed Gallery Items
    await Gallery.insertMany([
      {
        title: 'Grand Arangetram Performance',
        category: 'Arangetram',
        imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800',
        caption: 'Solo debut performance at Music Academy Auditorium, Chennai.'
      },
      {
        title: 'International Cultural Troupe Showcase',
        category: 'Performances',
        imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
        caption: 'Troupe showcase featuring authentic Tanjore style repertoire.'
      }
    ]);

    // 4. Seed Reviews
    await Review.insertMany([
      {
        name: 'Ananya Krishnan',
        role: 'Senior Disciple',
        comment: 'Learning under Guru Smt. Rukmini Viswanathan has transformed my understanding of Abhinaya and footwork precision.',
        rating: 5,
        isApproved: true
      }
    ]);

    console.log('✅ MongoDB Connected for Seeding...');
    console.log('✅ Admin User, Courses, Gallery & Reviews Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Data:', error.message);
    process.exit(1);
  }
};

seedData();