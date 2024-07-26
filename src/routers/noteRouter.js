const ensureAuthenticated = require('../middleware/auth.js');
const express = require('express');
const { Note, NoteVersion } = require('../models/models.js');
const router = express.Router();

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

// Update an existing note and save a version
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

        // Save the version
        await NoteVersion.create({
            noteId: id,
            title: note.title,
            content: note.content,
            createDate: new Date()
        });

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
});

// Get all versions for a specific note
router.get('/notes/:id/versions', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const versions = await NoteVersion.find({ noteId: id }).sort({ createDate: -1 });
        res.status(200).json(versions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// get a specific version by ID
router.get('/notes/versions/:versionId', async (req, res) => {
    const { versionId } = req.params;
    try {
        const version = await NoteVersion.findById(versionId);
        if (!version) {
            return res.status(404).json({ message: 'Version not found' });
        }
        res.status(200).json(version);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
