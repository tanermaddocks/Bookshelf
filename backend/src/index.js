const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// App routes
const bookRouter = require("./controllers/bookController");
app.use("/books", bookRouter)

// Default route
app.get("/", (request, response) =>{
  response.send("Bookshelf API");
});

// Database health check
app.get("/dbHealth", (request, response) => {
	response.json({
		status: "OK",
		name: mongoose.connection.name, 
		models: mongoose.connection.modelNames(),
		address: mongoose.connection.host, 
		readyState: mongoose.connection.readyState,
		nodeEnv: process.env.NODE_ENV
	});
});

module.exports = app;