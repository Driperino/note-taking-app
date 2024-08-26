require('dotenv').config(); // Load environment variables
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { Note, User } = require("./models/models");
const authRouter = require("./routers/authRouter");
const noteRouter = require("./routers/noteRouter");
const passport = require("passport");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");


app.use(cors()); // Using cors middleware for enabling cross-origin requests
app.use(express.json()); // Parsing incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use(express.json({ limit: '50mb' })); // Limiting the size of incoming JSON data

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false, // Change to true if using HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
}));

// Passport middleware initialization - must come after session middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Middleware to log session ID
app.use((req, res, next) => {
    console.log(`Session ID:`, req.sessionID);
    next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve static files from the static directory within public
app.use('/app', express.static(path.join(__dirname, '../public/static')));

// Assigning routes to routers
app.use('/auth', authRouter); // Use authRouter for handling authentication routes
app.use('/', noteRouter); // Use noteRouter for handling note routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status ?? 500).send(err);
});

// Starting the server
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Connecting to MongoDB

        app.listen(port, () => {
            console.log(`Server is up on port ${port}`); // Starting the server
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start(); // Call the start function to start the server
