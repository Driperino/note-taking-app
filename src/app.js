const mongoose = require("mongoose"); // Importing mongoose for MongoDB connection
const express = require("express"); // Importing express for creating server
const cors = require("cors"); // Importing cors for handling cross-origin requests
const { Note } = require("./models/models"); // Importing Note model
const authRouter = require("./routers/authRouter"); // Importing authRouter for handling authentication routes
const noteRouter = require("./routers/noteRouter"); // Importing noteRouter for handling note routes

require('dotenv').config(); // Loading environment variables

const app = express(); // Creating an instance of express
const port = process.env.PORT || 3000; // Setting the port for the server


app.use(cors()); // Using cors middleware for enabling cross-origin requests
app.use(express.json()); // Parsing incoming JSON data
app.use(express.static('../public')); // Serving static files from the 'public' directory
app.use(express.urlencoded({ extended: true })) // Parsing URL-encoded data
app.use(express.json({ limit: '50mb' })); // Limiting the size of incoming JSON data

app.use('/auth', authRouter); // Using authRouter for handling authentication routes
app.use('/', noteRouter); // Using noteRouter for handling note routes

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
