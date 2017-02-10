// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load the auth variables
var configAuth = require('./auth');

var db = require('../models');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID : configAuth.googleAuth.clientID,
        clientSecret : configAuth.googleAuth.clientSecret,
        callbackURL : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            db.User.findOne({
              where: { 'googleid' : profile.id }
            }).then(function(result) {
                if (result) {
                    // if a user is found, log them in
                    return done(null, result);
                } else {
                    // if the user isnt in our database, create a new user
                    db.User.create({
                      googleid : profile.id,
                      googletoken : token,
                      googlename : profile.displayName,
                      googleemail : profile.emails[0].value
                    }).then(function(newResult) {
                      return done(null, newResult);
                    });
                }
            });
        });

    }));

};
