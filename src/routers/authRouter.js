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

// Get user info ----------------------------------------------
router.get("/user", ensureAuthenticated, (req, res) => {
    console.log('User data:', req.user); // Log the user data to check the fields
    return res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        lastLogin: req.user.lastLogin,
        sessionID: req.sessionID,
        email: req.user.email,
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

// Patch Username ---------------------------------------------
router.patch("/username", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.username) {
            try {
                const newUsername = req.body.username;

                // Check if the new username already exists
                const existingUser = await User.findOne({ username: newUsername });
                if (existingUser && existingUser._id.toString() !== req.user.id.toString()) {
                    return res.status(400).json({ message: "Username already taken" });
                }

                // Proceed with the update if the username does not already exist
                const user = await User.findById(req.user.id);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                user.username = newUsername;
                await user.save();
                return res.status(200).json({ message: "Username updated successfully" });

            } catch (error) {
                console.error("Error updating username:", error);
                return res.status(500).json({ message: "Server error", error: error.message });
            }
        }
        return res.status(400).json({ message: "Please provide a new username" });
    }
    return res.status(401).send("Unauthorized");
});

// Patch password ---------------------------------------------
router.patch("/password", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.password) {
            const salt = crypto.randomBytes(16);

            crypto.pbkdf2(req.body.password, Buffer.from(salt, 'base64'), 310000, 32, 'sha256', async function (err, hashedPassword) {
                if (err) {
                    return next(`error while creating password hash: ${err}`);
                }
                try {
                    const user = await User.findById(req.user.id);
                    user.passwordSalt = salt.toString('base64');
                    user.passwordHash = hashedPassword.toString('base64');
                    await user.save();
                    res.status(200).json({ message: "Password updated successfully" });
                } catch (error) {
                    res.status(500).json({ message: "Server error", error: error.message });
                }
            });
        } else {
            res.status(400).json({ message: "Please provide a new password" });
        }
    } else {
        res.status(401).send("Unauthorized");
    }
});

// Delete user ----------------------------------------
router.delete("/user", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Delete all notes associated with the user
            await Note.deleteMany({ user: req.user.id });

            // Delete the user account
            await User.findByIdAndDelete(req.user.id);

            // Log out the user
            req.logout(function (err) {
                if (err) {
                    console.log(`Error while logging out: ${err}`);
                    return res.status(500).json({ message: "Error while logging out", error: err.message });
                }

                return res.status(200).json({ message: "User and associated notes deleted successfully" });
            });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    } else {
        return res.status(401).send("Unauthorized");
    }
});

// Put email ------------------------------------------------
router.put("/email", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.email) {
            try {
                const user = await User.findById(req.user.id);
                user.email = req.body.email;
                await user.save();
                return res.status(200).json({ message: "Email updated successfully" });
            } catch (error) {
                return res.status(500).json({ message: "Server error", error: error.message });
            }
        }
        return res.status(400).json({ message: "Please provide a new email" });
    }
    return res.status(401).send("Unauthorized");
});

// Patch email -----------------------------------------------
router.patch("/email", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.email) {
            try {
                const user = await User.findById(req.user.id);
                user.email = req.body.email;
                await user.save();
                return res.status(200).json({ message: "Email updated successfully" });
            } catch (error) {
                return res.status(500).json({ message: "Server error", error: error.message });
            }
        }
        return res.status(400).json({ message: "Please provide a new email" });
    }
    return res.status(401).send("Unauthorized");
});
router.patch('/theme', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const { theme } = req.body;

    console.log(`Received request to update theme for user ${userId} to ${theme}`); // Debug statement

    try {
        await User.findByIdAndUpdate(userId, { theme });
        console.log(`Theme updated successfully for user ${userId} to ${theme}`); // Debug statement
        res.status(200).json({ message: 'Theme updated successfully.' });
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ message: 'Failed to update theme.' });
    }
});
// Update last loaded note ID
router.patch('/users/last-loaded-note', ensureAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const { noteId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { lastLoadedNoteId: noteId });
        res.status(200).json({ message: 'Last loaded note updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update last loaded note', error: error.message });
    }
});

// Get last loaded note ID
router.get('/users/last-loaded-note', ensureAuthenticated, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        res.status(200).json({ lastLoadedNoteId: user.lastLoadedNoteId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get last loaded note', error: error.message });
    }
});

module.exports = router;
