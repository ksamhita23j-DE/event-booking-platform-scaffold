const mongoose = require("mongoose");

// TODO (you): once you have a real MongoDB Atlas cluster, put its connection
// string in backend/.env as MONGO_URI. This function just wires up the
// connection and fails loudly if it can't connect, which is what you want
// during development.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
