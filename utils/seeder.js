import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Review from '../models/Review.js';
import Gallery from '../models/Gallery.js';

dotenv.config();

const seedData = async () => {
  try {
    // Database connection check
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected for Seeding...');
    }

    // Clear existing data to avoid duplicates
    await User.deleteMany({ role: 'admin' });
    await Course.deleteMany({});
    await Review.deleteMany({});
    await Gallery.deleteMany({});

    // 1. Seed Admin User & Guru Profile
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);

    const adminUser = await User.create({
      username: 'admin',
      name: 'Guru Smt. Rukmini Viswanathan',
      email: 'gsilambarasan54@gmail.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 98400 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    });

    // 2. Seed Courses with Active Slots
    await Course.insertMany([
      {
        title: 'Prarambhik (Beginner Level)',
        category: 'Prarambhik (Beginner)',
        description: 'Introduction to basic Adavus, Talam structures, and fundamental body postures in Kalakshetra Bani.',
        duration: '12 Months',
        fee: 3500,
        level: 'Beginner',
        slots: [
          { batchTiming: 'Mon & Wed (07:00 AM - 08:30 AM)', availableSeats: 10, totalSeats: 15 },
          { batchTiming: 'Sat & Sun (09:00 AM - 11:00 AM)', availableSeats: 5, totalSeats: 15 }
        ]
      },
      {
        title: 'Madhyama (Intermediate Level)',
        category: 'Madhyama (Intermediate)',
        description: 'Focus on Varnam items, intricate Jathis, footwork precision, and basic Abhinaya (expression).',
        duration: '24 Months',
        fee: 4500,
        level: 'Intermediate',
        slots: [
          { batchTiming: 'Tue & Thu (05:30 PM - 07:00 PM)', availableSeats: 8, totalSeats: 12 }
        ]
      },
      {
        title: 'Uttama (Advanced Arangetram Track)',
        category: 'Uttama (Advanced)',
        description: 'Full Margam repertoire preparation, solo Arangetram choreography, and live orchestra alignment.',
        duration: '36 Months',
        fee: 6000,
        level: 'Advanced',
        slots: [
          { batchTiming: 'Private Masterclasses (Flexible)', availableSeats: 3, totalSeats: 5 }
        ]
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
        approved: true
      }
    ]);

    console.log('✅ Admin User & Complete Academy Data Seeded Successfully!');
    console.log('📧 Admin Email:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Data:', error.message);
    process.exit(1);
  }
};

seedData();