import express from 'express';
import { PORT } from './config';
var passport = require('passport'); 
var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
var GoogleStrategy = require('passport-google');
var FacebookStrategy = require('passport-facebook');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express();

import bodyParser from 'body-parser';


// Apply middlewares
import headersMiddleware from './middleware/headers';
import authMiddleware from './middleware/auth';

app.use(headersMiddleware);
app.use(authMiddleware);

//Passport
// Use the LocalStrategy within Passport to "sign in" users

passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    req.session.success = 'You are successfully logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));

// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localReg(username, password)
            .then(function (user) {
                if (user) {
                    console.log("REGISTERED: " + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));

// Passport session setup.
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});




// Parses 'application/json' bodies and hanges the
// resulting object at `req.body`.
app.use(bodyParser.json());


// Attach API routes
import testRouter from './routes/test';
import userRouter from './routes/user';
import sessionRouter from './routes/session';

app.use('/test', testRouter);
app.use('/user', userRouter);
app.use('/session', sessionRouter);


// Start the server.
const server = app.listen(PORT, () => {
  console.log(`Listening on ${server.address().port}...`);
});
