// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// !!! THIS IS A CONTROLLER - I THINK (TY) !!! If so we will need to run render commands through these routes.

// Dependencies
// =============================================================
var db = require("../models");


// Routes
// =============================================================
module.exports = function(app) {

    // HTML ROUTES
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

    // Find the 6 closest online users for the friendsdata.handlebars
    app.get("/onlineusers", function(req, res) {

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
                    res.render("pageName", { firstData: firstResult, secondData: result2 });
                })
            }),

    });


    // API ROUTES==============================================
    // Add a new user
    app.post("/api/newuser", function(req, res) {

        User.create({
            name: req.body.name,
            age: req.body.age,
            preferences: req.body.preferences
                // etc.


        })
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

    // Update user profile
    app.put("/api/profile", function(req, res) {
        db.User.update({
            name: req.body.name,
            age: req.body.age,
            preferences: req.body.preferences
                // etc.
        }, {
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return res.json(result);
        });
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

};
