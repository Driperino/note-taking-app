const express = require('express');
const { Note } = require('../models/models.js');

const router = express.Router();

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Get all notes for the authenticated user
router.get('/notes', ensureAuthenticated, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error in GET note router', error: error.message });
    }
});

// Get a single note by ID
router.get("/notes/:id", ensureAuthenticated, async (req, res) => {
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
router.post('/notes', ensureAuthenticated, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please provide title and content' });
    }

    try {
        const note = await Note.create({
            title,
            content,
            createDate: new Date(),
            user: req.user.id // Ensure this is the authenticated user's ID
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save note', error: error.message });
        console.log(`Error creating note in router: ${error}`);
    }
});

// Update an existing note
router.patch('/notes/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please provide title and content' });
    }

    try {
        const note = await Note.findByIdAndUpdate(
            id,
            { title, content, user: req.user.id },
            { new: true, useFindAndModify: false }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
});

// Delete a note
router.delete('/notes/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
});

module.exports = router;
