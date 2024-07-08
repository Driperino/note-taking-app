const mongoose = require("mongoose"); // Importing mongoose for MongoDB connection
const express = require("express"); // Importing express for creating server
const cors = require("cors"); // Importing cors for handling cross-origin requests
const { Note, User } = require("./models/models"); // Importing Note model
const authRouter = require("./routers/authRouter"); // Importing authRouter for handling authentication routes
const noteRouter = require("./routers/noteRouter"); // Importing noteRouter for handling note routes
const passport = require("passport"); // Importing passport for authentication
const session = require("express-session"); // Importing express-session for session management

require('dotenv').config(); // Loading environment variables

const app = express(); // Creating an instance of express
const port = process.env.PORT || 3000; // Setting the port for the server

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/app/login.html');
    }
};

app.use(cors()); // Using cors middleware for enabling cross-origin requests
app.use(express.json()); // Parsing incoming JSON data
app.use(express.urlencoded({ extended: true })) // Parsing URL-encoded data
app.use(express.json({ limit: '50mb' })); // Limiting the size of incoming JSON data

// Session middleware configuration
app.use(session({
    secret: 'u8nrO4qpry10sai35PSh3b',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60000
    } // change to true if using HTTPS
}));

// Passport middleware initialization - must come after session middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/app', express.static('../public')); // Serving static files from the 'public' directory
app.use('/auth', authRouter); // Using authRouter for handling authentication routes
app.use('/', noteRouter); // Using noteRouter for handling note routes

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' });
});

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
