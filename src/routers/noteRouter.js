const express = require("express");
const { Note } = require("../models/models.js");

const router = express.Router();


// Get filtered notes
router.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user._id
        });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server error in GET note router ", error: error.message });
    }
});

// Get a single note by ID
router.get("/notes/:id", async (req, res) => {
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
router.put("/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Please provide title and content" });
    }

    try {
        const note = await Note.create({
            title: title,
            content: content,
            createDate: new Date(),
            user: req.user._id
        });
        console.log(note);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to save note", error: error.message });
    }
});

// Update an existing note
router.patch("/notes/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Please provide a note ID" });
    }
    if (!title || !content) {
        return res.status(400).json({ message: "Please provide title and content" });
    }
    try {
        const note = await Note.findByIdAndUpdate(
            id,
            { title: title, content: content, user: req.user._id },
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

router.delete("/notes/:id", async (req, res) => {
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

module.exports = router;