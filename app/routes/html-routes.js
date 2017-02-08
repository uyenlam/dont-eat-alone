// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads welcome.handlebars
  app.get("/", function(req, res) {
    res.render("welcome");
  });

  //
  // app.get("/confirm", function(req, res) {
  //   res.render("confirm");
  // });
  //
  // app.get("/findpeople", function(req, res) {
  //   res.render("findpeople");
  // });

  // app.get("/friendsdata", function(req, res) {
  //   db.User.findAll({ //pass in the parameters here for {{each user}}
  //   }).then(function(allFriends){
  //     res.render("friendsdata", {user:allFriends});
  //   })
  // });


};
