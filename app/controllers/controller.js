// // *********************************************************************************
// // api-routes.js - this file offers a set of routes for displaying and saving data to the db
// // *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

// Routes
// =============================================================
module.exports = function(app) {

    app.use(function(req, res, next) {
        if (req.user) {
            res.locals.user = req.user.username
        }
        next()
    });

    // HTML ROUTES==================================================
    // index route loads welcome.handlebars
    app.get("/", function(req, res) {
        res.render("welcome");
    });

    app.get("/confirm", function(req, res) {
      // find the username on the database that matches the current session's username
      db.User.findOne({
          where: {
              //req.user.name returns information of the user in this session
              username: req.user.username
          }
      }).then(function(res1) {
        // render the result into the user variable on the confirm.handlebars page
        res.render("confirm",{user: res1});
      })
    });

    app.get("/findpeople", function(req, res) {
        res.render("findpeople");
    });

    // Make sure the user is signed in first, then find the 6 closest online users for the friendsdata.handlebars
    app.get("/onlineusers", require('connect-ensure-login').ensureLoggedIn(), function(req1, res) {

        db.User.findAll({
                // find all online users
                where: {
                    online: true
                },
                limit: 6,
                order: [
                        [sequelize.col("location"), "DESC"]
                    ] // This will be the sort to who is closer (don't know how to do yet)
              }).then(function(result1) {
                  // find information of the current logged in user
                  db.User.findOne({
                    where:{
                      username: req.user.username
                    }
                  }).then(function(result2) {
                      // find all received and sent requests
                      db.Request.findAll({
                        where: {
                            // find in the Request model where it matches the logged-in user's id, found in result2
                            $or: [{ sender: result2.id }, { recipient: result2.id }] // I think this is correct syntax for "or" in query
                        }
                    }).then(function(result3){
                      // pass results into variables that work with handlebars
                      res.render("onlineusers", { onlineusers: result1, user: result2, requester: result3 });
                    });
                });
              });
    });

    // app.get('/profile',
    //     require('connect-ensure-login').ensureLoggedIn(),
    //     function(req, res) {
    //         res.render('profileplaceholder', { user: req.user });
    //     });


    // API ROUTES==============================================
    // This link is called on the welcome.js page
    // Sign up link
    app.post("/api/signup", function(req, res, next) {
        // check if the same username already exists
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(function(user) {
            // if the username doesn't exist, proceed to create a new one
            if (!user) {
                db.User.create({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password),
                    photoLink: req.body.photoLink,
                }).then(function(user) {
                    // if authentication fails, redirect back to welcome page
                    // if authentication succeeds, redirect to confirm page
                    passport.authenticate("local", { failureRedirect: "/welcome", successRedirect: "/confirm", failureFlash: "Failed to create a new user" })(req, res, next)
                })
            } else { // if it does, then prevent signing up, redirect back to the welcome page to sign in instead
                res.send("user exists");
                res.redirect("/welcome");
            }
        })
    });

    //sign in link
    app.post("/api/signin", passport.authenticate('local', {
        failureRedirect: '/welcome',
        successRedirect: '/confirm',
        failureFlash: 'Invalid username or password.'
    }));

    app.put("/api/signout", function(req, res) {
        db.User.update({
          // change the online status to false once signed out
          online: false
        },{
          where: {
            username: req.user.username
          }
        }).then(function(result){
          req.session.destroy()
          res.redirect("/welcome");
        })
    });

    // Add more information to a new user - this link is called on the confirm.js page
    app.put("/api/confirmuser", function(req1, res) {

        db.User.update({
            name: req1.body.name,
            age: req1.body.age,
            occupation: req1.body.occupation,
            photoLink: req1.body.photoLink,
            vegetarian: req1.body.vegetarian,
            differentDiet: req1.body.differentDiet,
            favFood: req1.body.favFood,
            leastFood: req1.body.leastFood,
            favDrink: req1.body.favDrink,
            leastDrink: req1.body.leastDrink,
            introExtro: req1.body.introExtro,
            freeTime: req1.body.freeTime,
            payView: req1.body.payView,
            cookView: req1.body.cookView,
            minAvail: req1.body.minAvail,
            locationLat: req1.body.location.lat,
            locationLong: req1.body.location.long,
            locationName: req1.body.locationName,
            // once the user signs in, his online status is changed to true
            online: true,
        },{
            where: {
                // where the username matches the username of the current session
                username: req.user.username
            }
        }).then(function(result) {
            return res.json(result);
        });;

        // Uyen: I'm not sure what's the purpose of the following function?
        //=================================================================
        // db.User.register(req.body.username, req.body.password, function(err, account) {
        //     if (err) {
        //         console.log(err);
        //         return res.json(err);
        //     }
        //     passport.authenticate('local')(req, res, function() {
        //         res.redirect('/');
        //     });
        // });
        //=================================================================

    });


    // Get user info based on id
    app.get("/api/:userid", function(req, res) {
        db.User.findOne({
            where: {
                id: req.params.userid
            }
        }).then(function(result) {
            return res.json(result);
        })
    });


    // Log user on
    app.put("/api/status/:user/:onoff", function(req, res) {
        db.User.update({
            // Boolean true/false
            online: req.params.onoff
        }, {
            where: {
                id: req.params.user
            }
        }).then(function(result) {
            return res.json(result);
            // redirect?
        });
    });


    // Update user location
    app.get("/api/:user/location", function(req, res) {
        db.User.update({
            location: // location results from Google Maps call
        }, {
            where: {
                id: req.params.user
            }
        }).then(function(result) {
            return res.json(result);
            // redirect?
        });
    });



    // Get all request sent to or by user
    app.get("/api/:user/findrequests", function(req, res) {
        db.Request.findAll({
            where: {
                $or: [{ sender: req.params.user }, { recipient: req.params.user }] // I think this is correct syntax for "or" in query
            }
        }).then(function(result) {
            return res.json(result);
        })
    });



    // Create new request to another user
    app.post("/api/:user/newrequest", function(req, res) {
        db.Request.create({
            recipient: req.params.user,
            sender: req.user,
            text: req.body.text
                // etc.
        })
    });

    // Respond to request
    app.put("/api/respond/:request/:status", function(req, res) {
        db.Request.update({
            // Likely accepted/declined
            status: req.params.status
        }, {
            where: {
                request: req.params.request
            }
        }).then(function(result) {
            return res.json(result);
            // We will need to figure out how to add a listener to notify other user of change
        });
    });

    //Get location information
    app.get('/nearby/:lat/:lon', function(req, res) {

        console.log('req.params', req.params)
        client.getGeocode({
            lat: req.params.lat,
            lon: req.params.lon,
        }, function(err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.send('error');
                console.log(err);
            }
        });

    });

};
