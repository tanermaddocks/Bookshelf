const app = require("./index.js");
const connectDB = require("./utils/database.js");

// Define the port
const PORT = process.env.PORT || 3000;

// Define database URL
const dbName = process.env.npm_package_name;
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/" + dbName;

// Run the server 
app.listen(PORT, async () => {
  await connectDB(dbURL);
  console.log("Bookshelf server is running on port:" + PORT);
});