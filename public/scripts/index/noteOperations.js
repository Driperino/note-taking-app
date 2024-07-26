// noteOperations.js
import { timeSince, clearFieldsMain, showErrorModal } from "./uiInteractions.js";
import { API_URL, notesMenu } from "./script.js";

export const noteTitleArea = document.getElementById('noteTitle');
export const noteContentTextarea = document.getElementById('noteContent');
export const noteDateArea = document.getElementById('noteDate');
export const noteDateAgeArea = document.getElementById('noteDateAge');
export let currentNoteID = '';

export async function newNote() {
    if (currentNoteID) {
        console.log("User chose to create a new note");
        showErrorModal("New Note Created");
        clearFieldsMain();
        clearVersionList(); // Clear the version list when creating a new note
        currentNoteID = '';
    } else {
        showErrorModal("New Note Created");
        clearFieldsMain();
        clearVersionList(); // Clear the version list when creating a new note
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
        console.log('Note saved:', response);
        showErrorModal(`${noteTitle} Saved`);

        await fetchNotes();
        await fetchVersions(currentNoteID); // Fetch versions after saving
    } catch (error) {
        console.error(`Error saving Note ${noteTitle}`, error);
        showErrorModal("Error saving note");
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
            showErrorModal(`${note.title} created`);
            currentNoteID = note._id;
            console.log('Updated Note ID:', currentNoteID);
            await fetchVersions(currentNoteID); // Fetch versions after creating
        } else {
            console.error('Failed to create note:', response.status, response.statusText);
            showErrorModal('Failed to create note');
        }
    } catch (error) {
        console.error('Error creating note:', error);
        showErrorModal('Error creating note');
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
            console.log('Note deleted:', response);
            showErrorModal(`${noteTitle} deleted`);

        } catch (error) {
            console.error(`Error deleting Note ${noteTitle}`, error);
            showErrorModal("Error deleting note");
        }
    } else {
        showErrorModal("No note to delete");
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
    const noteId = event.target.dataset.noteId;
    console.log(`Selecting note ID: ${noteId}`); // Log the selected note ID
    try {
        const response = await fetch(`/notes/${noteId}`);
        if (!response.ok) {
            throw new Error(`Error fetching response from /notes/${noteId}`);
        }
        const note = await response.json();
        noteTitleArea.value = note.title;
        noteContentTextarea.value = note.content;
        currentNoteID = note._id;
        const date = new Date(note.createDate);
        const localDate = date.toLocaleDateString();
        const localTime = date.toLocaleTimeString();
        noteDateArea.innerHTML = `${localDate} at ${localTime}`;
        noteDateAgeArea.innerHTML = timeSince(date);

        await fetchVersions(noteId); // Fetch versions when a note is selected

        // Store the note ID in local storage
        localStorage.setItem('lastLoadedNoteId', noteId);

        // Store the note ID on the server
        await fetch('/users/last-loaded-note', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ noteId })
        });
    } catch (error) {
        console.error('Error fetching note details:', error);
    }
}

// Fetch versions for a note
export async function getNoteById(noteId) {
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

        await fetchVersions(noteId); // Fetch versions when a note is selected
    } catch (error) {
        console.error('Error fetching note details:', error); // Log an error message to the console
    }
}

// fetchVersions function to fetch versions for a specific note and populate the version list
export async function fetchVersions(noteId) {
    console.log(`Fetching versions for note ID: ${noteId}`); // Log the note ID being fetched
    try {
        const response = await fetch(`/notes/${noteId}/versions`);
        if (!response.ok) {
            throw new Error('Failed to Fetch Versions');
        }
        const versions = await response.json();
        console.log('Versions:', versions); // Log the versions received

        const versionList = document.getElementById('version-list');
        versionList.innerHTML = ''; // Clear the version list

        // Update the version count
        const versionCountElement = document.getElementById('versionCount');
        versionCountElement.textContent = versions.length;

        let counter = 0;

        versions.forEach(version => {

            console.log('Version:', version); // Log each version

            const versionItem = document.createElement('div');
            versionItem.className = 'ml-8 px-2 py-1 rounded-sm flex justify-between items-center';

            const versionText = document.createElement('span');
            versionText.textContent = new Date(version.createDate).toLocaleString();

            const restoreButton = document.createElement('button');
            restoreButton.className = 'bg-primary/50 hover:bg-primary text-sm font-bold text-text rounded-md px-3 py-0.5 mr-8';
            restoreButton.textContent = 'Restore';
            restoreButton.onclick = () => restoreVersion(version._id);

            versionItem.appendChild(versionText);
            versionItem.appendChild(restoreButton);
            versionList.appendChild(versionItem);

            const hr = document.createElement('hr');
            hr.className = counter % 2 === 0 ? 'mx-8 border-primary/50' : 'mx-4 border-primary/50';
            versionList.appendChild(hr);
            counter++; // Increment the counter after each iteration
        });

    } catch (error) {
        console.error('Error fetching versions:', error); // Log the error
    }
}

// Restore a specific version
export async function restoreVersion(versionId) {
    console.log(`Restoring version ID: ${versionId}`); // Add this line for debugging
    try {
        const response = await fetch(`/notes/versions/${versionId}`);
        if (!response.ok) {
            throw new Error(`Error fetching response from /notes/versions/${versionId}`);
            showErrorModal('Failed to fetch version details');
        }
        const version = await response.json();
        noteTitleArea.value = version.title;
        noteContentTextarea.value = version.content;
        console.log(`versionId: ${versionId}`, version); // Log version details (optional)
        showErrorModal(`Version restored: ${version.title}`);
    } catch (error) {
        console.error('Error fetching version details:', error); // Log an error message to the console
        showErrorModal('Error fetching version details');
    }
}

// clearVersionList function to clear the version list
export function clearVersionList() {
    const versionList = document.getElementById('version-list');
    versionList.innerHTML = ''; // Clear the version list

    // Also clear the version count
    const versionCountElement = document.getElementById('versionCount');
    versionCountElement.textContent = '0';
}

