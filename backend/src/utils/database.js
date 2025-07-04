const mongoose = require("mongoose");

// Define database URL
const isTest = (process.env.NODE_ENV == "test" ? "-test" : "");
const dbName = process.env.npm_package_name + isTest;
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/" + dbName;

// Function to connect to database
async function connectDB () {
  console.log("Attempting to connect to database: " + dbURL)

  try {

    await mongoose.connect(dbURL);
    console.log("Connected to database!");

  } catch (error) {

    console.error("Database connection error: " + error.message);
    
  }
};

module.exports = connectDB;