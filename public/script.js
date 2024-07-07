//const { get } = require("mongoose")
const API_URL = "http://localhost:3000"

//This Variable NEEDS to be set BEFORE saving a note, otherwise it will not work
let currentNoteID = 'false' //Might replace this later on with a more robust solution

//Display *temporary* confirmation text function
function displayText(text) {
    const statusText = document.getElementById('noteStatus')
    statusText.innerHTML = text
    setTimeout(function () { statusText.innerHTML = "" }, 3000)
}

function clearText() {
    document.getElementById('noteTitle').value = ''
    document.getElementById('noteContent').value = ''
    currentNoteID = ''
    document.getElementById('noteID').innerHTML = ''
    document.getElementById('noteID').dataset.noteId = ''
    document.getElementById('noteDate').innerHTML = ''
}

//Expanding menus 
//Menu button
document.getElementById('menuButton').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
});
//Notes button
document.getElementById('notesButton').addEventListener('click', function () {
    const notesMenu = document.getElementById('notesMenu');
    if (notesMenu.classList.contains('hidden')) {
        notesMenu.classList.remove('hidden');
    } else {
        notesMenu.classList.add('hidden');
    }
});


///API Functions-----------------------------------------------------------------
//New Note function
/*
    if theres a note ask if you want to save the note
    then clear all the fields

    if no note just clear all the fields
*/
async function newNote() {
    if (currentNoteID) {
        if (confirm("You have a note open, would you still like to create a new note?")) {

            displayText("New Note Created")
        } else {
            console.log("User chose not to create a new note")
        }
    }
}

//Save Note function
async function saveNote() {
    if (currentNoteID) {
        try {
            const noteTitle = document.getElementById('noteTitle').value
            const noteContent = document.getElementById('noteContent').value
            const response = await fetch(`${API_URL}/notes/${currentNoteID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: currentNoteID,
                    title: noteTitle,
                    content: noteContent
                })
            })
            displayText(`${noteTitle} Saved`)
        } catch (error) {
            console.error(`Error saving Note ${noteTitle}`, error)
            displayText("Error saving note")
        }
    } else if (!currentNoteID) {
        try {
            const noteTitle = document.getElementById('noteTitle').value
            const noteContent = document.getElementById('noteContent').value
            const response = await fetch(`${API_URL}/notes/${currentNoteID}`, {
                method: 'Put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: noteTitle,
                    content: noteContent,
                    createDate: new Date()
                })
            })
            displayText(`${noteTitle} Created`)
        } catch (error) {
            console.error(`Error creating Note: ${noteTitle}`, error)
            displayText("Error creating note")
        }
    } else {
        console.log("Cannot Create new note, id already loaded.")
    }

}

//Delete Note function
async function deleteNote() {
    if (currentNoteID) {
        try {
            const noteTitle = document.getElementById('noteTitle').value
            const noteContent = document.getElementById('noteContent').value
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
            })
            displayText(`${noteTitle} deleted`)
        } catch (error) {
            console.error(`Error deleting Note ${noteTitle}`, error)
            displayText("Error deleting note")
        }
    } else {
        displayText("No note to delete")
        console.log("No note to delete")
    }
}
//Get note function DEPRICATED WAS FOR TESTINGGGGG
/* async function getNote() {
    try {
        const response = await fetch(`${API_URL}/notes`)
        const data = await response.json()
        console.log(data)
 
        //Area IDs
        const noteTitle = document.getElementById('noteTitle')
        const contentArea = document.getElementById('noteContent')
        const idArea = document.getElementById('noteID')
        const noteDate = document.getElementById('noteDate')
 
        //status text
        const getStatus = document.getElementById('noteStatus')
 
        if (data.length) {
            console.log(data[0].title, data[0].content)
            noteTitle.value = data[0].title //Update the title area
            contentArea.innerHTML = data[0].content //Update the content area
            currentNoteID = data[0]._id //Update the gloval variable
            idArea.dataset.noteId = currentNoteID //Update the ID area
            idArea.innerHTML = currentNoteID //Use global variable to update the ID area
            noteDate.innerHTML = data[0].createDate //Update the date area
            displayText("Note Aquired")
        } else {
            noteTitle.innerHTML = "Click the 'New Note' button to create a new note"
            contentArea.innerHTML = "Sad Note Taking App noises..."
            console.log("No notes found")
            displayText("No notes found")
 
        }
    } catch (error) {
        console.error('Error fetching notes:', error)
    }
} */
//------------------------------------------------------------------------------

//Event Listeners
//Had to do this for scoping reasons
document.addEventListener('DOMContentLoaded', () => {
    const notesMenu = document.getElementById('notesMenu')
    const noteContentTextarea = document.getElementById('noteContent')
    const noteTitleArea = document.getElementById('noteTitle')
    const noteidArea = document.getElementById('noteID')
    const noteDateArea = document.getElementById('noteDate')

    // Function to fetch notes from backend and populate notesMenu
    async function fetchNotes() {
        try {
            const response = await fetch('/notes');
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const notes = await response.json();

            // Clear notesMenu before populating it
            notesMenu.innerHTML = '';

            notes.forEach(note => {
                const li = document.createElement('li')
                li.classList.add('mb-2')
                const a = document.createElement('a')
                a.href = '#'
                a.classList.add('block', 'text-purple-900', 'bg-darkGray-100', 'hover:text-purple-300')
                a.textContent = note.title // Adjust based on your note structure
                a.dataset.noteId = note._id // Store note ID as a data attribute
                a.addEventListener('click', handleNoteClick)
                li.appendChild(a)
                notesMenu.appendChild(li)
            })
        } catch (error) {
            console.error('Error fetching notes:', error)
        }
    }

    async function handleNoteClick(event) {
        const noteId = event.target.dataset.noteId;
        try {
            const response = await fetch(`/notes/${noteId}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const note = await response.json();
            noteTitleArea.value = note.title; // Display note title in title area
            noteContentTextarea.value = note.content // Display note content in textarea
            noteidArea.dataset.noteId = note._id // Store note ID as a data attribute
            noteidArea.innerHTML = note._id // Display note ID in ID area
            noteDateArea.innerHTML = note.createDate // Display note creation date in date area
            currentNoteID = note._id // Update current note ID
            console.log(`noteId: ${noteId}`, note) // Log note details (optional)
        } catch (error) {
            console.error('Error fetching note details:', error)
        }
    }

    fetchNotes();


    //new
    const newButton = document.getElementById('newButton')
    if (newButton) {
        newButton.addEventListener('click', async () => {
            await newNote()
            await fetchNotes()
            clearText()
        });
    }
    //save
    const saveButton = document.getElementById('saveButton')
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            await saveNote()
            await fetchNotes()
        });
    }
    //delete
    const deleteButton = document.getElementById('deleteButton')
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            await deleteNote()
            await fetchNotes()
            clearText()
        });
    }
});