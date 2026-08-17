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

    const adminUser = await User.create({
      username: 'admin',
      name: 'Guru Smt. Rukmini Viswanathan',
      email: 'gsilambarasan54@gmail.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 98400 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    });

    // 2. Seed All Courses (Including Nattuvangam & Rhythm)
    await Course.insertMany([
      {
        title: 'Prarambhik (Beginner Level)',
        category: 'Prarambhik (Beginner)',
        description: 'Introduction to basic Adavus, Talam structures, and fundamental body postures in Kalakshetra Bani.',
        duration: '12 Months',
        schedule: 'Mon & Wed (07:00 AM - 08:30 AM)',
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
        schedule: 'Tue & Thu (05:30 PM - 07:00 PM)',
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
        schedule: 'Flexible Private Sessions',
        fee: 6000,
        level: 'Advanced',
        slots: [
          { batchTiming: 'Private Masterclasses (Flexible)', availableSeats: 3, totalSeats: 5 }
        ]
      },
      {
        title: 'Nattuvangam & Rhythm Mastery',
        category: 'Nattuvangam & Rhythm',
        description: 'Mastery of Cymbals (Talam), Solkattu recite training, Jathi structure composition, and orchestra direction for live dance performances.',
        duration: '6 Months',
        schedule: 'Fri & Sat (06:00 PM - 07:30 PM)',
        fee: 5000,
        level: 'Intermediate/Advanced',
        slots: [
          { batchTiming: 'Fri & Sat (06:00 PM - 07:30 PM)', availableSeats: 6, totalSeats: 10 }
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

    console.log('✅ Admin User & All Courses (including Nattuvangam) Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Data:', error.message);
    process.exit(1);
  }
};

seedData();