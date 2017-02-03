// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var Book = require("../models/book.js");


// Routes
// =============================================================
module.exports = function(app) {

  // Get all books
  app.get("/api/all", function(req, res) {
    Book.findAll({}).then(function(result){
      return res.json(result);
    })
  });

  // Get a specific book
  app.get("/api/:book", function(req, res) {
    Book.findOne({
        where: {
          title: req.params.book
        }
    }).then(function(result) {  //sequelize is promise-based so .then() will work
      return res.json(result);
    })
  });

  // Get all books of a specific genre
  app.get("/api/genre/:genre", function(req, res) {
    Book.findAll({
        where: {
          genre: req.params.genre
        }
    }).then(function(result) {
      return res.json(result);
    })
  });

  // Get all books from a specific author
  app.get("/api/author/:author", function(req, res) {
    Book.findAll({
        where: {
          author: req.params.author
        }
    }).then(function(result) {
      return res.json(result);
    })
  });

  // Get all "long" books (books 300 pages or more)
  app.get("/api/books/long", function(req, res) {
    Book.findAll({
        where: {
          page_numbers: {
            $gte: 300,
          }
        }
    }).then(function(result) {
      return res.json(result);
    })
  });

  // Get all "short" books (books 150 pages or less)
  app.get("/api/books/short", function(req, res) {
    Book.findAll({
        where: {
          page_numbers: {
            $lte: 150,
          }
        }
    }).then(function(result) {
      return res.json(result);
    })
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
    var reqId = req.body.id;

    Book.destroy({
      where:{
        id: reqId
      }
    })
  });

};
