const express = require("express");
const Book = require("../models/bookModel.js");

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
bookRouter.post(
  "/",
  async (request, response) => {
    try {

      const { title, authors, genres } = request.body;

      const newBook = await Book.create({
        title,
        authors,
        genres,
      });

      response.status(201).json({
        success: true,
        data: newBook,
      });

    } catch (error) {

      response.json({
        success: false,
        error: error.message,
      });

    }
  }
);

// PATCH one
// DELETE all
// DELETE one

module.exports = bookRouter