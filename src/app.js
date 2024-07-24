const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { Note, User } = require("./models/models");
const authRouter = require("./routers/authRouter");
const noteRouter = require("./routers/noteRouter");
const passport = require("passport");
const session = require("express-session");
const app = express(); // Creating an instance of express
const port = process.env.PORT || 3000; // Setting the port for the server

require('dotenv').config(); // Loading environment variables

app.use(cors()); // Using cors middleware for enabling cross-origin requests
app.use(express.json()); // Parsing incoming JSON data
app.use(express.urlencoded({ extended: true })) // Parsing URL-encoded data
app.use(express.json({ limit: '50mb' })); // Limiting the size of incoming JSON data

// Session middleware configuration-----------------------------------------------------------
app.use(session({
    secret: 'u8nrO4qpry10sai35PSh3b',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 604800000 // 1 week
    } // change secure to true if using HTTPS
}));

// Passport middleware initialization - must come after session middleware---------------------
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Middleware to log session ID
app.use((req, res, next) => {
    console.log(`Session ID:`, req.sessionID);
    next();
});
//--------------------------------------------------------------------------------------------

// Serving static files from the 'public' directory
app.use('/app', express.static('../public')); // Serving static files from the 'public' directory

//Assinging routes to routers------------------------------------------------------------------
app.use('/auth', authRouter); // Using authRouter for handling authentication routes
app.use('/', noteRouter); // Using noteRouter for handling note routes
//--------------------------------------------------------------------------------------------

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status ?? 500).send(err);
});

// Starting the server
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/note-taking-app'); // Connecting to MongoDB

        app.listen(port, () => {
            console.log(`Server is up on port ${port}`); // Starting the server
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start(); // Calling the start function to start the server
