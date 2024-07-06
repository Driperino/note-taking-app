const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { Note } = require("./models/models");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../public')); // Add this line to serve static files

app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find(); // Filter by user here if necessary
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.put("/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Please provide title and/or content" });
    }

    try {
        const note = new Note({
            title,
            content,
            createDate: new Date()
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to save note" });
    }
});

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/note-taking-app');

        app.listen(port, () => {
            console.log(`Server is up on port ${port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();
