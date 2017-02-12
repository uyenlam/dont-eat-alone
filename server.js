// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");
var express      = require('express');
var fs           = require('fs');
var ejs          = require('ejs');
var app          = new express();
var bodyParser   = require('body-parser');
var http         = require('http');
var path         = require('path');
var zomato       = require('zomato');
var env          = process.env;

//
// var passport = require('passport');
// var session = require('express-session');
//
//
// app.use(session({ secret: 'super-secret' }));
// 
// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.use(User.createStrategy());
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
// sets up zomato api integrated this code from index.ejs (chad)
var client = zomato.createClient({
  userKey: '67439a2a6001f3cc23b26aba575a54ff', //as obtained from [Zomato API](https://developers.zomato.com/apis)
});
// integrated this code from index.ejs (chad)
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// the following 4 lines of code were integrated (chad)
app.enable('trust proxy');
//app.use(express.static(__dirname + '/public')); commented out (chad)
//app.set('view engine', 'ejs'); commented out because this integration is not needed bc we are using handlebars (chad)
//app.set('views', __dirname + '/public'); commented out (chad)

// Static directory
app.use(express.static("app/public"));

//
// // Requiring our models for syncing
var db = require("./app/models"); //requiring the whole model.
var request = require('request');

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/*get route for confirm
app.get("/confirm", function(req, res){ 

	request('http://www.google.com', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    // console.log(body) // Show the HTML for the Google homepage. 
	    res.end(body);
	  }
	})

}); 
*/ // commented out this part this is old code from sean (chad)

//INTEGRATE THIS INTO FILES (chad)
app.get('/', function (req,res) {
	res.render('confirm');
}); // changed res.render('index') which references index.ejs to confirm which references confirm.js (chad)
// also changed es6 syntax to vanilla javascript
app.get('/nearby/:lat/:lon', function(req, res){

    console.log('req.params', req.params); //added semicolon here (chad)
  client.getGeocode({
    lat:req.params.lat,
    lon:req.params.lon,
    }, function(err, result){
        if(!err){
          res.send(result);
        }else {
            res.send('error');
          console.log(err);
        }
  });

}); ///added semicolon here (chad)


/*var server = app.listen(env.NODE_PORT || 8000, env.NODE_IP || 'localhost', () => {
	console.log('At the URL: http://localhost:8000');
}); */  


/*Routes
// =============================================================
//require("./app/routes/api-routes.js")(app);
//require("./app/routes/html-routes.js")(app);*/ 
//commented out this part bc we're not using a routes page (chad)


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
