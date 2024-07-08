const express = require("express");
const { User } = require("../models/models.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require('crypto');
const session = require('express-session');

const router = express.Router();

// Configure Passport
passport.use(new LocalStrategy(async function (username, password, done) {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false, { message: "Incorrect username or password." });
        }

        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return done(err); }
            if (!crypto.timingSafeEqual(Buffer.from(user.passwordHash, 'base64'), hashedPassword)) {
                return done(null, false, { message: "Incorrect username or password." });
            }
            return done(null, user);
        });
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, cb) => {
    process.nextTick(function () {
        return cb(null, {
            id: user._id,
            username: user.username
        })
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

router.use(session({
    secret: 'u8nrO4qpry10sai35PSh3b',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Change to true if using HTTPS
        maxAge: 60000 // Session max age in milliseconds
    }
}));

router.use(passport.initialize());
router.use(passport.session());

// Register a new user
router.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
    const salt = crypto.randomBytes(16).toString('base64');

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Please provide a username and password" });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) {
                return next('Error while creating password hash');
            }

            const newUser = await User.create({
                username: username,
                passwordSalt: salt,
                passwordHash: hashedPassword.toString('base64')
            });

            req.login(newUser, function (err) {
                if (err) {
                    console.log(`Error while logging in: ${err}`);
                    return next(err);
                }
                console.log(`User ${username} created successfully, now logging in.`);
                return res.redirect('/app');
            });
        });
    } catch (error) {
        console.log(`Error while creating user: ${error}`);
        return next(error);
    }
});

// Login route
router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log(`Error while authenticating user: ${err}`);
            return next(err);
        }
        if (!user) {
            console.log(`Authentication failed: ${info.message}`);
            return res.redirect('/app/login.html');
        }
        req.login(user, (err) => {
            if (err) {
                console.log(`Error while logging in: ${err}`);
                return next(err);
            }
            console.log(`User ${user.username} logged in successfully.`);
            return res.redirect('/app');
        });
    })(req, res, next);
});

// Logout route
router.post("/logout", (req, res) => {
    req.logout();
    console.log("User logged out successfully."); // Add logging here
    res.redirect('/app/login.html');
});

module.exports = router;
