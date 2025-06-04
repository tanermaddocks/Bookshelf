const mongoose = require("mongoose");

// Function to connect to database
async function connectDB (dbURL) {
  try {
    await mongoose.connect(dbURL);
    console.log("Connected to database: " + dbURL);
  } catch (error) {
    console.error("Database connection error: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;