const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/note-taking-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Note = mongoose.model('Note', {
    title: String,
    content: String
});
