const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { Note } = require("./models/models");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }));

// Get all notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find(); // Filter by user here if necessary
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get a single note by ID
app.get("/notes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Create a new note
app.put("/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Please provide title and content" });
    }

    try {
        const note = await Note.create({
            title: title,
            content: content,
            createDate: new Date()
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to save note", error: error.message });
    }
});

// Update an existing note
app.patch("/notes/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Please provide a note ID" });
    }

    try {
        const note = await Note.findByIdAndUpdate(
            id,
            { title: title, content: content },
            { new: true, useFindAndModify: false }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to update note", error: error.message });
    }
});

app.delete("/notes/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Please provide a note ID" });
    }

    try {
        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete note", error: error.message });
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
};

start();
