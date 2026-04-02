const mongoose = require("mongoose");

const connectDB = async (uri) => {
  if (!uri) throw new Error("MongoDB URI not provided in .env");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;