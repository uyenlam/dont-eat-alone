
// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies - general
// =============================================================
var express = require("express");
var app = express();
var fs = require('fs');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs 	= require("express-handlebars");

//Dependencies for location function
// =============================================================
var http = require('http');
var path = require('path');
var zomato = require('zomato');
var env = process.env;
var client = zomato.createClient({
  userKey: '67439a2a6001f3cc23b26aba575a54ff', //as obtained from [Zomato API](https://developers.zomato.com/apis)
});


//Dependencies for sign-in functions
// =============================================================
var bcrypt = require("bcrypt-nodejs");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require('./app/config/db');
var User = require("./app/models/user")(db);

// Passing information to each variable
// =============================================================
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'super-secret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// Passport.js
// =============================================================

passport.use(new LocalStrategy(function(username, pass, cb){
  var hashedPass = bcrypt.hashSync(pass)
  User.findOne({
    where: {
      username: username
    }
  }).then(function(user, err){
    if (err) { return cb(err); }
    if (!user) {
    return cb(null, false); }
    if (!bcrypt.compareSync(pass, user.password)){
      return cb(null, false); }
    return cb(null, user);
  })
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id).then(function (user) {
    cb(null, user);
    //console.log("this is happening");
  });
});


// Notif for successful server connection
app.listen(3000, function() {
  console.log("Listening on port 3000")
});
