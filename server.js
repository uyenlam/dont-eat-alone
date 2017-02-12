// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var fs = require('fs');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs 	= require("express-handlebars");
var http = require('http');
var path = require('path');
var zomato = require('zomato');
var env = process.env;
var client = zomato.createClient({
  userKey: '67439a2a6001f3cc23b26aba575a54ff', //as obtained from [Zomato API](https://developers.zomato.com/apis)
});

//


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("app/public"));

//
// // Requiring our models for syncing
var db = require("./app/models"); //requiring the whole model.

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
