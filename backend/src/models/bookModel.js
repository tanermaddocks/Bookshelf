const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genres: [String],
  rating: Number,
}, {timestamps: true});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;