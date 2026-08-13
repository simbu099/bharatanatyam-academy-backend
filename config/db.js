const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables!");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`\n======================================================`);
    console.log(`🚀 [MongoDB Atlas Connected Successfully]`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database Name: ${conn.connection.name}`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;