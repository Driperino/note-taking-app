const mongoose = require('mongoose');

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

// User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
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
    }

});

const User = mongoose.model('User', userSchema);

module.exports = { Note, User };
