const mongoose = require("mongoose");

// Define database URL
const dbName = process.env.npm_package_name;
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/" + dbName;

// Function to connect to database
async function connectDB () {
  try {

    await mongoose.connect(dbURL);
    console.log("Connected to database: " + dbURL);

  } catch (error) {

    console.error("Database connection error: " + error.message);
    process.exit(1);
    
  }
};

module.exports = connectDB;