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
        res.render("confirm");
    });

    app.get("/findpeople", function(req, res) {
        res.render("findpeople");
    });

    // Make sure the user is signed in first, then find the 6 closest online users for the friendsdata.handlebars
    app.get("/onlineusers", require('connect-ensure-login').ensureLoggedIn(), function(req, res) {

        db.User.findAll({
                where: {
                    online: true
                },
                limit: 6,
                order: [
                        [sequelize.col("location"), "DESC"]
                    ] // This will be the sort to who is closer (don't know how to do yet)
            }).then(function(result) {
                firstResult = result;
                db.Request.findAll({
                    where: {
                        $or: [{ sender: req.params.user }, { recipient: req.params.user }] // I think this is correct syntax for "or" in query
                    }
                }).then(function(result2) {
                    res.render("onlineusers", { firstData: firstResult, secondData: result2 });
                })
            }),

    });

    // app.get('/profile',
    //     require('connect-ensure-login').ensureLoggedIn(),
    //     function(req, res) {
    //         res.render('profileplaceholder', { user: req.user });
    //     });


    // API ROUTES==============================================
    // This link is called on the welcome.js page
    app.post("/api/signup", function(req, res, next) {
        // check if the same username already exists
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(function(user) {
            // if the username doesn't exist, proceed to create a new one
            if (!user) {
                User.create({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password)
                }).then(function(user) {
                    passport.authenticate("local", { failureRedirect: "/welcome", successRedirect: "/confirm" })(req, res, next)
                })
            } else { // if it does, then prevent signing up, redirect back to the welcome page
                res.send("user exists");
                res.redirect("/welcome");
            }
        })
    });

    app.post("/api/signin", passport.authenticate('local', {
        failureRedirect: '/welcome',
        successRedirect: '/confirm'
    }));

    app.get("/api/signout", function(req, res) {
        req.session.destroy()
        res.redirect("/welcome");
    });

    // Add more information to a new user - this link is called on the confirm.js page
    app.put("/api/newuser", function(req, res) {

        db.User.update({
            name: req.body.name,
            age: req.body.age,
            occupation: req.body.occupation,
            photoLink: req.body.photoLink,
            vegetarian: req.body.vegetarian,
            differentDiet: req.body.differentDiet,
            favFood: req.body.favFood,
            leastFood: req.body.leastFood,
            favDrink: req.body.favDrink,
            leastDrink: req.body.leastDrink,
            introExtro: req.body.introExtro,
            freeTime: req.body.freeTime,
            payView: req.body.payView,
            cookView: req.body.cookView,
            minAvail: req.body.minAvail,
            locationLat: req.body.location.lat,
            locationLong: req.body.location.long,
            locationName: req.body.locationName
        } {
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return res.json(result);
        });;

        User.register(req.body.username, req.body.password, function(err, account) {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            passport.authenticate('local')(req, res, function() {
                res.redirect('/');
            });
        });
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



    // Create new request
    app.post("/api/:user/newrequest", function(req, res) {
        Request.create({
            sender: req.params.user,
            recipient: req.body.recipient,
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
