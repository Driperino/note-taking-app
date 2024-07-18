const express = require("express");
const { User, Note } = require("../models/models.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require('crypto');
const session = require("express-session");

const router = express.Router();

// Configure Passport ----------------------------------------
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return cb(null, false, { message: "Incorrect username or password." })
        }

        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return cb(err);
            }

            if (!crypto.timingSafeEqual(Buffer.from(user.passwordHash, 'base64'), hashedPassword)) {
                return cb(null, false, {
                    message: "Incorrect username or password."
                });
            }
            return cb(null, user);
        });
    } catch (error) {
        return cb(error);
    }
}));

// Configure Session Management-------------------------------
passport.serializeUser((user, cb) => {
    process.nextTick(function () {
        return cb(null, {
            id: user._id,
            username: user.username,
            lastLogin: user.lastLogin
        })
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// Login route------------------------------------------------
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            console.log(`Error while Authenticathing login in: ${err}`);
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

    crypto.pbkdf2(req.body.password, Buffer.from(salt, 'base64'), 310000, 32, 'sha256', async function (err, hashedPassword) {
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

            req.login(user, function (err) {
                if (err) {
                    return next(`Error while logging in: ${err}`);
                }
                res.redirect('/app');
            });
        } catch (error) {
            return next({ status: 500, message: "Failed to create user", error: error.message });
        };

    });
});
// Get user info ----------------------------------------------
router.get("/user", (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            id: req.user.id, // Use req.user._id for MongoDB _id
            username: req.user.username,
            lastLogin: req.user.lastLogin,
            sessionID: req.sessionID,
            email: req.user.email
        });
    } else {
        return res.status(401).send("Unauthorized");
    }
});

// Patch Username ---------------------------------------------
router.patch("/username", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.username) {
            try {
                const user = await User.findById(req.user.id);
                user.username = req.body.username;
                await user.save();
                return res.status(200).json({ message: "Username updated successfully" });
            } catch (error) {
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

// Delete user $$ Notes----------------------------------------
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

// Logout route
router.post("/logout", (req, res, next) => {
    req.logout(function (err) {
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