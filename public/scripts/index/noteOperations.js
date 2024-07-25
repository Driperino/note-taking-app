// noteOperations.js
import { timeSince, displayText, displayTextSettings, clearFieldsMain } from "./uiInteractions.js";
import { API_URL, notesMenu } from "./script.js";

export const noteTitleArea = document.getElementById('noteTitle');
export const noteContentTextarea = document.getElementById('noteContent');
export const noteDateArea = document.getElementById('noteDate');
export const noteDateAgeArea = document.getElementById('noteDateAge');
export let currentNoteID = '';

export async function newNote() {
    if (currentNoteID) {
        console.log("User chose to create a new note");
        displayText("New Note Created");
        clearFieldsMain();
        currentNoteID = '';
    } else {
        displayText("New Note Created");
        clearFieldsMain();
        currentNoteID = '';
    }
}

export async function saveNote() {
    try {
        const noteTitle = document.getElementById('noteTitle').value;
        const noteContent = document.getElementById('noteContent').value;
        const response = await fetch(`${API_URL}/notes/${currentNoteID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: currentNoteID,
                title: noteTitle,
                content: noteContent,
            })
        });

        currentNoteID = response._id;
        displayText(`${noteTitle} Saved`);
        await fetchNotes();
    } catch (error) {
        console.error(`Error saving Note ${noteTitle}`, error);
        displayText("Error saving note");
    }
}

export async function createNote() {
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;

    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: noteTitle,
                content: noteContent
            }),
            credentials: 'include'
        });

        if (response.ok) {
            const note = await response.json();
            console.log('Note created:', note);
            displayText(`${note.title} created`);
            currentNoteID = note._id;
            console.log('Updated Note ID:', currentNoteID);
        } else {
            console.error('Failed to create note:', response.status, response.statusText);
            displayText('Failed to create note');
        }
    } catch (error) {
        console.error('Error creating note:', error);
        displayText('Error creating note');
    }
}

export async function deleteNote() {
    if (currentNoteID) {
        try {
            const noteTitle = document.getElementById('noteTitle').value;
            const noteContent = document.getElementById('noteContent').value;
            const response = await fetch(`${API_URL}/notes/${currentNoteID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: currentNoteID,
                    title: noteTitle,
                    content: noteContent
                })
            });
            displayText(`${noteTitle} deleted`);
        } catch (error) {
            console.error(`Error deleting Note ${noteTitle}`, error);
            displayText("Error deleting note");
        }
    } else {
        displayText("No note to delete");
        console.log("No note to delete");
    }
}

// Function to fetch notes from backend and populate notesMenu
export async function fetchNotes() {
    try {
        const response = await fetch('/notes'); // Send a GET request to the API endpoint for fetching notes
        if (!response.ok) {
            throw new Error('Failed to Fetch Notes. !response throw', error) // Throw an error if the response is not ok
        }
        const notes = await response.json(); // Parse the response as JSON
        console.log('Notes:', notes) // Log notes

        if (!notes) {
            console.log('No notes found') // Log notes
            throw new Error('No notes found', error) // Throw an error if no notes are found
            //displayText("No notes found") // Display error message UNREACHABLE //TODO FIX
        }

        // Clear notesMenu before populating it
        notesMenu.innerHTML = '';

        notes.forEach(note => {
            const li = document.createElement('li') // Create a new <li> element
            li.classList.add('mb-2') // Add the class 'mb-2' to the <li> element
            const a = document.createElement('a') // Create a new <a> element
            a.href = '#' // Set the href attribute of the <a> element to '#'
            a.classList.add('block', 'text-text', 'bg-background', 'hover:text-secondary', 'text-shadow-sm') // Add classes to the <a> element
            a.textContent = note.title // Set the text content of the <a> element to the note title
            a.dataset.noteId = note._id // Store note ID as a data attribute
            a.addEventListener('click', selectNote) // Add a click event listener to the <a> element
            li.appendChild(a) // Append the <a> element to the <li> element
            notesMenu.appendChild(li) // Append the <li> element to the notesMenu
        })
    } catch (error) {
        console.error('Error fetching notes:', error) // Log an error message to the console
    }
}

// Select Note from List
export async function selectNote(event) {
    const noteId = event.target.dataset.noteId; // Get the note ID from the data attribute of the clicked element
    try {
        const response = await fetch(`/notes/${noteId}`); // Send a GET request to fetch a specific note
        if (!response.ok) {
            throw new Error(`Error fetching response from /notes/${noteId}`); // Throw an error if the response is not ok
        }
        const note = await response.json(); // Parse the response as JSON
        noteTitleArea.value = note.title; // Display note title in title area
        noteContentTextarea.value = note.content; // Display note content in textarea
        console.log(`noteId: ${noteId}`, note); // Log note details (optional)

        currentNoteID = note._id; // Update current note ID
        const date = new Date(note.createDate); // Convert note creation date to Date object
        const localDate = date.toLocaleDateString(); // Display note creation date in date area
        const localTime = date.toLocaleTimeString(); // Display note creation time in date area
        noteDateArea.innerHTML = `${localDate} at ${localTime}`; // Display note creation date in date area
        noteDateAgeArea.innerHTML = timeSince(date); // Display note creation time in date area
    } catch (error) {
        console.error('Error fetching note details:', error); // Log an error message to the console
    }
}


//get note by ID
export async function getNoteById(currentNoteID) {
    try {
        const response = await fetch(`/notes/${currentNoteID}`); // Send a GET request to fetch a specific note
        if (!response.ok) {
            throw new Error(`Error fetching response from /notes/${currentNoteID}`); // Throw an error if the response is not ok
        }
        const note = await response.json(); // Parse the response as JSON

        const date = new Date(note.createDate); // Convert note creation date to Date object
        const localDate = date.toLocaleDateString(); // Display note creation date in date area
        const localTime = date.toLocaleTimeString(); // Display note creation time in date area
        const noteDate = document.getElementById('noteDate'); // Ensure this element reference is correct
        if (noteDate) {
            noteDate.innerHTML = `${localDate} at ${localTime}`; // Display note creation date in date area
            noteDateAgeArea.innerHTML = timeSince(date); // Display note creation time in date area
        } else {
            console.error('Element noteDate not found');
        }
        console.log(`noteId: ${currentNoteID}`, note); // Log note details (optional)
    } catch (error) {
        console.error('Error fetching note details:', error); // Log an error message to the console
    }
}