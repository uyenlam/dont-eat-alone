// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var Request = require("../models/request.js");

var User = require("../models/user.js");
// Routes
// =============================================================
module.exports = function(app) {

  // Get all books
  app.get("/api/all", function(req, res) {

  });

  // Get a specific book
  app.get("/api/:book", function(req, res) {

  });

  // Get all books of a specific genre
  app.get("/api/genre/:genre", function(req, res) {

  });

  // Get all books from a specific author
  app.get("/api/author/:author", function(req, res) {

  });

  // Get all "long" books (books 300 pages or more)
  app.get("/api/books/long", function(req, res) {

  });

  // Get all "short" books (books 150 pages or less)
  app.get("/api/books/short", function(req, res) {

  });

  // Add a book
  app.post("/api/new", function(req, res) {
    // Take the request...
    var book = req.body;

    // Then add the character to the database using sequelize
    Book.create({
      title: book.title,
      author: book.author,
      genre: book.genre,
      page_numbers: book.page_numbers,
    })
  });

  // Delete a book
  app.post("/api/delete", function(req, res) {
    
  });

};
