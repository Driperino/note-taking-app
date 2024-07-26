const mongoose = require('mongoose');

// Note version schema
const noteVersionSchema = new mongoose.Schema({
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    vNumber: {
        type: Number,
        required: true
    }
});

const NoteVersion = mongoose.model('NoteVersion', noteVersionSchema);

// Note schema
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Note = mongoose.model('Note', noteSchema);

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    passwordSalt: {
        type: String,
        required: function () {
            return !this.googleId && !this.githubId; // Required if not using OAuth
        }
    },
    passwordHash: {
        type: String,
        required: function () {
            return !this.googleId && !this.githubId; // Required if not using OAuth
        }
    },
    createDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now,
        required: false
    },
    verified: {
        type: Boolean,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    theme: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: false
    },
    githubId: {
        type: String,
        required: false
    },
    lastLoadedNoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
        required: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { Note, NoteVersion, User };
