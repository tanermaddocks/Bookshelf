const express = require("express");
const Book = require("../models/bookModel.js");

// Define router
const bookRouter = express.Router();

// GET all
bookRouter.get(
  "/all",
  async (request, response) => {
    try {

      // Retrieve all books
      const allBooks = await Book.find();

      // Return all books
      response.json({
        success: true,
        operation: "GET",
        count: allBooks.length,
        data: allBooks,
      });

    } catch (error) {

      response.status(400).json({
        success: false,
        error: error.message,
      });

    }
  }
);


// GET one
bookRouter.get(
  "/:bookId",
  async (request, response) => {

    try {

      const oneBook = await Book.findById(
        request.params.bookId,
      );

      response.json({
        success: true,
        operation: "GET",
        data: oneBook,
      });

    } catch (error) {

      response.status(400).json({
        success: false,
        error: error.message,
      });

    }

  }
);


// POST one
bookRouter.post(
  "/",
  async (request, response) => {
    try {

      const { title, author, genres } = request.body;

      const newBook = await Book.create({
        title,
        author,
        genres,
      });

      response.status(201).json({
        success: true,
        operation: "POST",
        data: newBook,
      });

    } catch (error) {

      response.status(400).json({
        success: false,
        error: error.message,
      });

    }
  }
);


// PATCH one
bookRouter.patch(
  "/:bookId",
  async (request, response) => {
    try {

      const updatedBook = await Book.findByIdAndUpdate(
        request.params.bookId,
        request.body,
        { new: true }
      );

      response.status(200).json({
        success: true,
        operation: "PATCH",
        data: updatedBook,
      });
    } catch (error) {

      response.status(400).json({
        success: false,
        error: error.message,
      });

    }

  }
);


// DELETE one
bookRouter.delete(
  "/:bookId",
  async (request, response) => {

    try {

      const deletedBook = await Book.findByIdAndDelete(
        request.params.bookId,
      );

      response.status(200).json({
        success: true,
        operation: "DELETE",
        data: deletedBook,
      });

    } catch (error) {

      response.status(400).json({
        success: false,
        error: error.message,
      });

    }
  }
);


module.exports = bookRouter