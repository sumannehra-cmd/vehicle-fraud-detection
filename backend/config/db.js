const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    process.exit(1);  // error aaye toh server band kar do
  }
};

module.exports = connectDB;