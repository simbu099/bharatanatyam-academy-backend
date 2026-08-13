const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Slot = require('../models/Slot');
const Review = require('../models/Review');
const Gallery = require('../models/Gallery');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder]: Cleaning existing database records...');
    await User.deleteMany();
    await Course.deleteMany();
    await Slot.deleteMany();
    await Review.deleteMany();
    await Gallery.deleteMany();

    // 1. Create Default Admin User & Guru Profile
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);

    const adminUser = await User.create({
      name: 'Guru Smt. Rukmini Viswanathan',
      email: 'admin@natyabharati.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 98400 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    });

    console.log(`[Seeder]: Created Admin Account -> admin@natyabharati.com / Admin@12345`);

    // 2. Create Authentic Bharatanatyam Courses
    const courses = await Course.insertMany([
      {
        title: 'Prarambhik Adavu Sangeetham (Foundation Level)',
        code: 'BN-101',
        category: 'Prarambhik (Beginner)',
        description: 'Comprehensive introduction to basic Bharatanatyam adavus (Tatta, Natta, Tatti Mettu, Kuditta Mettu), Hastha Mudras (Single & Double hand gestures), and fundamental posture (Araimandi & Samapadam).',
        durationMonths: 6,
        level: 'Beginner',
        feeMonthly: 2500,
        badge: 'Beginner Choice',
        image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=800',
        syllabus: [
          { topic: 'Basic Body Geometry & Araimandi', details: 'Perfecting foundational stance and balance footwork' },
          { topic: 'Single & Double Hand Gestures', details: '28 Asamyuta and 24 Samyuta Hasthas with shlokas' },
          { topic: 'First 4 Groups of Adavus', details: 'Tatta, Natta, Tatti Mettu, and Kuditta Mettu in 3 speeds' },
        ],
      },
      {
        title: 'Madhyama Alarippu & Jatiswaram (Intermediate)',
        code: 'BN-201',
        category: 'Madhyama (Intermediate)',
        description: 'Intermediate training focusing on items of the traditional Margam syllabus. Master complex rhythmic combinations (Jatis), Alarippu in various Jaathis, and intricate melodic Jatiswarams.',
        durationMonths: 12,
        level: 'Intermediate',
        feeMonthly: 3500,
        badge: 'Most Popular',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
        syllabus: [
          { topic: 'Alarippu in Tisra & Misra Chapu', details: 'Rhythmic flower invocation to the stage and deity' },
          { topic: 'Jatiswaram in Ragam Kalyani', details: 'Melodic convergence of Swaras and crisp Nritta' },
          { topic: 'Shabdam & Abhinaya Expressions', details: 'Introduction to emotional portrayal (Navarasas)' },
        ],
      },
      {
        title: 'Uttama Varnam & Arangetram Intensive (Advanced)',
        code: 'BN-301',
        category: 'Uttama (Advanced)',
        description: 'Mastery over the pinnacle of Bharatanatyam—the Varnam. Seamless blend of Nritta (pure rhythmic dance) and Nritya (expressive storytelling). Preparing dancers for soloist Arangetram debuts.',
        durationMonths: 18,
        level: 'Advanced',
        feeMonthly: 5000,
        badge: 'Mastery',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
        syllabus: [
          { topic: 'Grand Tanjore Quartette Varnams', details: 'Execution of 45-minute central performance repertoire' },
          { topic: 'Deep Navarasa Abhinaya & Padams', details: 'Nuanced facial expressions, Kshetrayya & Annamacharya Padams' },
          { topic: 'Tillana in Revati / Hindolam', details: 'Sculptural postures, speed variations, and celebratory climax' },
        ],
      },
      {
        title: 'Nattuvangam & Carnatic Rhythm Masterclass',
        code: 'BN-401',
        category: 'Nattuvangam & Rhythm',
        description: 'Specialized certification course in the art of playing Cymbals (Talam), wielding the Nattuvangam, and reciting Solkattu (rhythmic syllables) for dance accompaniment.',
        durationMonths: 4,
        level: 'All Levels',
        feeMonthly: 3000,
        badge: 'Specialized',
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
        syllabus: [
          { topic: 'Tala Shastra & 35 Tala System', details: 'Deep dive into Suladi Sapta Talas and Chapu variations' },
          { topic: 'Solkattu Recitation Technique', details: 'Vocal modulation for crisp rhythmic execution' },
          { topic: 'Cymbal Striking Dynamics', details: 'Bronze & brass cymbal acoustic mastery for stage' },
        ],
      },
    ]);

    console.log(`[Seeder]: Created ${courses.length} Bharatanatyam Courses`);

    // 3. Create Timed Slots for Courses
    const slots = [];
    courses.forEach((c) => {
      slots.push(
        {
          course: c._id,
          days: 'Monday & Wednesday',
          startTime: '07:00 AM',
          endTime: '08:30 AM',
          batchName: `${c.code} Morning Dawn Batch`,
          maxCapacity: 12,
          bookedCount: 4,
          isActive: true,
        },
        {
          course: c._id,
          days: 'Tuesday & Thursday',
          startTime: '05:30 PM',
          endTime: '07:00 PM',
          batchName: `${c.code} Evening Sunset Batch`,
          maxCapacity: 15,
          bookedCount: 8,
          isActive: true,
        },
        {
          course: c._id,
          days: 'Saturday & Sunday',
          startTime: '09:00 AM',
          endTime: '11:00 AM',
          batchName: `${c.code} Weekend Special Batch`,
          maxCapacity: 10,
          bookedCount: 6,
          isActive: true,
        }
      );
    });

    await Slot.insertMany(slots);
    console.log(`[Seeder]: Created ${slots.length} Schedule Slots`);

    // 4. Create Student Reviews & Testimonials
    await Review.insertMany([
      {
        name: 'Dr. Meenakshi Sundaram',
        role: 'Parent of Arangetram Graduate',
        rating: 5,
        comment: 'Guru Rukmini ji does not just teach steps; she instills deep cultural discipline and devotion to the art. My daughter’s Arangetram under her guidance was an unforgettable spiritual milestone.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        isApproved: true,
      },
      {
        name: 'Ananya Raghavan',
        role: 'Senior Student (Uttama Batch)',
        rating: 5,
        comment: 'The structured syllabus and focus on footwork precision (Araimandi) set Natya Bharati apart. The live nattuvangam practice sessions boosted my confidence tremendously!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        isApproved: true,
      },
      {
        name: 'Suresh Kumar',
        role: 'Festival Director, Madras Music Academy Showcase',
        rating: 5,
        comment: 'We invited Natya Bharati Academy troupe for our Annual Heritage Cultural Fest. Their synchronicity, costume grandeur, and thematic Varnam performance mesmerized 1,200+ attendees.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        isApproved: true,
      },
    ]);

    console.log('[Seeder]: Created Sample Reviews');

    // 5. Create Showcase Gallery Items
    await Gallery.insertMany([
      {
        title: 'Grand Arangetram Recital 2025',
        category: 'Arangetram',
        imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=800',
        caption: 'Solo debut recital accompanied by full live Carnatic Orchestra.',
        eventDate: 'December 2025',
      },
      {
        title: 'International Heritage Dance Festival',
        category: 'Performances',
        imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
        caption: 'Troupe performance featuring 12 disciples executing Synchronized Tillana.',
        eventDate: 'January 2026',
      },
      {
        title: 'Abhinaya & Navarasa Workshop with Senior Gurus',
        category: 'Workshops',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
        caption: 'Intensive 3-day masterclass on emotional expressions and facial geometry.',
        eventDate: 'March 2026',
      },
      {
        title: 'Nattuvangam & Cymbal Acoustic Practice Session',
        category: 'Academy Life',
        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
        caption: 'Students practicing rhythmic recitation with brass cymbals.',
        eventDate: 'May 2026',
      },
    ]);

    console.log('[Seeder]: Created Gallery Items');
    console.log('\n[Seeder SUCCESS]: Database initialized cleanly!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
