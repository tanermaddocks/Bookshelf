const Book = require("../models/bookModel.js");
const express = require("express");

// Define router
const bookRouter = express.Router();

// GET all
bookRouter.get(
  "/all",
  async (request, response) => {

    // Retrieve all books
    const allBooks = await Book.find();

    // Return all books
    response.json({
      success: true,
      count: allBooks.length,
      data: allBooks,
    });

  }
);

// GET one
bookRouter.get(
  "/:bookId",
  async (request, response) => {

    const oneBook = await Book.findById(request.params.bookId);

    response.json({
      success: true,
      data: oneBook,
    });

  }
);

// POST one
// PATCH one
// DELETE all
// DELETE one