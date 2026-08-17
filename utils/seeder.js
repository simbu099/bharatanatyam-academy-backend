import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // 'bcrypt' use pannina 'bcryptjs' bathula 'bcrypt' nu mathiko
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdminUser = async () => {
  try {
    // Database connection check
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected for Seeding...');
    }

    // Existing admin users-a delete panni duplicate error thavirkalam (Optional)
    await User.deleteMany({ role: 'admin' });

    // 1. Create Default Admin User & Guru Profile
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt); // <-- Unakku pidicha password-a inga mathikko

    const adminUser = await User.create({
      username: 'admin',
      name: 'Guru Smt. Rukmini Viswanathan',
      email: 'gsilambarasan54@gmail.com', // <-- Updated Email
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 98400 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    });

    console.log('✅ Admin User Created Successfully:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Admin User:', error.message);
    process.exit(1);
  }
};

seedAdminUser();