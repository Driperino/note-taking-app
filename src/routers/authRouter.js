const ensureAuthenticated = require('../middleware/auth.js');
const express = require("express");
const { User, Note } = require("../models/models.js");
const passport = require("passport");
const localStrategy = require('../config/localStrategy');
const googleStrategy = require('../config/googleStrategy');
const githubStrategy = require('../config/githubStrategy');
const crypto = require('crypto');

const router = express.Router();

// Configure Passport ----------------------------------------
passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);

// Configure Session Management-------------------------------
passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, {
            id: user._id,
            username: user.username,
            lastLogin: user.lastLogin,
            email: user.email,
            theme: user.theme,
            createDate: user.createDate
        });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});
// -----------------------------------------------------------
// GitHub auth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/app');
});

// Google auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/app');
});

// Login route------------------------------------------------
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            console.log(`Error while Authenticating login in: ${err}`);
            return next(err);
        }
        req.login(user, async (err) => {
            if (err) {
                console.log(`Error while logging in: ${err}`);
                return next(err);
            }

            // Update lastLogin field
            user.lastLogin = new Date();
            try {
                await user.save();
                console.log(`User ${user.username} logged in successfully.`);
                return res.redirect('/app');
            } catch (err) {
                return next(err);
            }
        });
    })(req, res, next);
});

// Register a new user-----------------------------------------
router.post("/register", async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Please provide a username and password" });
    }
    const user = await User.findOne({
        username: req.body.username
    });
    if (user) {
        next({
            status: 400, message: "User already exists"
        });
    }

    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(req.body.password, Buffer.from(salt, 'base64'), 310000, 32, 'sha256', async (err, hashedPassword) => {
        if (err) {
            return next(`error while creating password hash: ${err}`);
        }
        try {
            const user = await User.create({
                username: req.body.username,
                passwordSalt: salt.toString('base64'),
                passwordHash: hashedPassword.toString('base64')
            });

            if (!user) {
                next({ status: 500, message: "Failed to create user" });
            }

            req.login(user, (err) => {
                if (err) {
                    return next(`Error while logging in: ${err}`);
                }
                res.redirect('/app');
            });
        } catch (error) {
            return next({ status: 500, message: "Failed to create user", error: error.message });
        }
    });
});

// Google auth routes ----------------------------------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/app');
});

// GitHub auth routes ----------------------------------------
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/app');
});

// Get user info ----------------------------------------------
router.get("/user", ensureAuthenticated, (req, res) => {
    console.log('User data:', req.user); // Log the user data to check the fields
    return res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        lastLogin: req.user.lastLogin,
        sessionID: req.sessionID,
        email: req.user.email, // Ensure this field is included
        theme: req.user.theme
    });
});

// Logout route ----------------------------------------------
router.post("/logout", ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.log(`Error while logging out: ${err}`);
            return next(err);
        }
        console.log(`User ${req.user ? req.user.username : 'unknown'} logged out successfully.`);
        console.log(`session ID ${req.sessionID}`);
        return res.redirect('/app/login.html');
    });
});

module.exports = router;
