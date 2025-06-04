const app = require("./index.js");
const connectDB = require("./utils/database.js");

// Define the port
const PORT = process.env.PORT || 3000;

// Run the server 
app.listen(PORT, async () => {
  await connectDB();
  console.log("Bookshelf server is running on port:" + PORT);
});