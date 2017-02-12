var express = require('express');
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt-nodejs");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./app/config/db');
var User = require("./app/models/user")(db);
var exphbs = require("express-handlebars");

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

app.use(function(req, res, next){
  if(req.user){
    res.locals.user = req.user.username
  }
  next()
});

app.get("/", function(req, res){
  res.redirect("/posts")
});

app.get("/posts", function(req, res){
  res.render("posts")
});

app.get("/signin", function(req, res){
  res.render("signin")
});

app.get("/signup", function(req, res){
  res.render("signup")
});

app.get("/signout", function(req, res){
  req.session.destroy()
  res.redirect("/posts")
});

app.post("/signin", passport.authenticate('local', {
  failureRedirect: '/signin',
  successRedirect: '/posts'
}));

app.post("/signup", function(req, res, next){
  User.findOne({
    where: {
     username: req.body.username
    }
  }).then(function(user){
    if(!user){
      User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password)
      }).then(function(user){
        passport.authenticate("local", {failureRedirect:"/signup", successRedirect: "/posts"})(req, res, next)
      })
    } else {
      res.send("user exists")
    }
  })
});

app.listen(3000, function() {
  console.log("Listening on port 3000")
});
