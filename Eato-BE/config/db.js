// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("111111")
    if (!uri) {
      console.error('MONGO_URI not set in .env');
      process.exit(1);
    }
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // helpful debug info (no secrets)
    if (error.name) console.error('Error name:', error.name);
    if (error.code) console.error('Error code:', error.code);
    process.exit(1);
  }
};

module.exports = connectDB;

