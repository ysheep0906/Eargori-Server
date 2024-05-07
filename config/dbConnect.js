const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  }
  catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;