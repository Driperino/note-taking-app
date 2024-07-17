//const { get } = require("mongoose") // Commented out, not used in the code

const API_URL = "http://localhost:3000" // API URL for the backend server

// This Variable NEEDS to be set BEFORE saving a note, otherwise it will not work
let currentNoteID = 'false' // Current note ID, initially set to 'false'

// Display *temporary* confirmation text function
function displayText(text) {
    const statusText = document.getElementById('noteStatus') // Get the element with ID 'noteStatus'
    statusText.innerHTML = text // Set the innerHTML of the element to the provided text
    setTimeout(function () { statusText.innerHTML = "" }, 3000) // Clear the text after 3 seconds
}

// Clear text fields and reset currentNoteID
function clearText() {
    document.getElementById('noteTitle').value = '' // Clear the value of the element with ID 'noteTitle'
    document.getElementById('noteContent').value = '' // Clear the value of the element with ID 'noteContent'
    currentNoteID = '' // Reset currentNoteID to an empty string
    document.getElementById('noteID').innerHTML = '' // Clear the innerHTML of the element with ID 'noteID'
    document.getElementById('noteID').dataset.noteId = '' // Clear the data attribute 'noteId' of the element with ID 'noteID'
    document.getElementById('noteDate').innerHTML = '' // Clear the innerHTML of the element with ID 'noteDate'
}

// Expanding menus 
// Menu button
document.getElementById('menuButton').addEventListener('click', function () {
    const menu = document.getElementById('menu'); // Get the element with ID 'menu'
    if (menu.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        menu.classList.remove('hidden'); // Remove the class 'hidden' from the element
    } else {
        menu.classList.add('hidden'); // Add the class 'hidden' to the element
    }
});

// Notes button
document.getElementById('notesButton').addEventListener('click', function () {
    const notesMenu = document.getElementById('notesMenu'); // Get the element with ID 'notesMenu'
    if (notesMenu.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        notesMenu.classList.remove('hidden'); // Remove the class 'hidden' from the element
    } else {
        notesMenu.classList.add('hidden'); // Add the class 'hidden' to the element
    }
});

// Settings Menu button

document.getElementById('settingsButton').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings'); // Get the element with ID 'settingsMenu'
    const main = document.getElementById('main'); // Get the element with ID 'main'

    if (settingsMenu.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        settingsMenu.classList.remove('hidden'); // Remove the class 'hidden' from the element
        main.classList.add('hidden'); // Add the class 'hidden' to the element
    }
});

// Close Settings Menu button

document.getElementById('closeSettings').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings'); // Get the element with ID 'settingsMenu'
    const main = document.getElementById('main'); // Get the element with ID 'main'

    if (main.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        settingsMenu.classList.add('hidden'); // Remove the class 'hidden' from the element
        main.classList.remove('hidden'); // Add the class 'hidden' to the element
    }
});


// /// API Functions -----------------------------------------------------------------

// // New Note function
// /*
//     If there's a note, ask if you want to save the note,
//     then clear all the fields.
//     If no note, just clear all the fields.
// */
// async function newNote() {
//     if (currentNoteID) { // Check if currentNoteID is truthy (not empty or false)
//         //I want to make a good looking confirmation box but this will do for now...
//         if (confirm("You have a note open, would you still like to create a new note?")) { // Show a confirmation dialog
//             displayText("New Note Created") // Display confirmation text
//         } else {
//             console.log("User chose not to create a new note") // Log a message to the console
//         }
//     }
// }

// Save Note function // Split this into 2 functions, one for saving and one for creating,
//                         and then put the check in the onclick call the function from there

// Save Note function
async function saveNote() {
    try {
        const noteTitle = document.getElementById('noteTitle').value // Get the value of the element with ID 'noteTitle'
        const noteContent = document.getElementById('noteContent').value // Get the value of the element with ID 'noteContent'
        const response = await fetch(`${API_URL}/notes/${currentNoteID}`, { // Send a PATCH request to the API endpoint for updating a note
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

        currentNoteID = response._id // Update current note ID
        displayText(`${noteTitle} Saved`) // Display confirmation text
    } catch (error) {
        console.error(`Error saving Note ${noteTitle}`, error) // Log an error message to the console
        displayText("Error saving note") // Display error message
    }
}

// Create Note function
async function createNote() {
    try {
        const noteTitle = document.getElementById('noteTitle').value // Get the value of the element with ID 'noteTitle'
        const noteContent = document.getElementById('noteContent').value // Get the value of the element with ID 'noteContent'
        const response = await fetch(`${API_URL}/notes/${currentNoteID}`, { // Send a PUT request to the API endpoint for creating a new note
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

        currentNoteID = response._id // Update current note ID
        displayText(`${noteTitle} Created`) // Display confirmation text
    } catch (error) {
        console.error(`Error creating Note: ${noteTitle}`, error) // Log an error message to the console
        displayText("Error creating note") // Display error message
    }
}

// // Delete Note function
// async function deleteNote() {
//     if (currentNoteID) { // Check if currentNoteID is truthy (not empty or false)
//         try {
//             const noteTitle = document.getElementById('noteTitle').value // Get the value of the element with ID 'noteTitle'
//             const noteContent = document.getElementById('noteContent').value // Get the value of the element with ID 'noteContent'
//             const response = await fetch(`${API_URL}/notes/${currentNoteID}`, { // Send a DELETE request to the API endpoint for deleting a note
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     _id: currentNoteID,
//                     title: noteTitle,
//                     content: noteContent
//                 })
//             })
//             displayText(`${noteTitle} deleted`) // Display confirmation text
//         } catch (error) {
//             console.error(`Error deleting Note ${noteTitle}`, error) // Log an error message to the console
//             displayText("Error deleting note") // Display error message
//         }
//     } else {
//         displayText("No note to delete") // Display message
//         console.log("No note to delete") // Log a message to the console
//     }
// }

//logout function
async function logout() {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, { // Send a POST request to the API endpoint for logging out
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.redirected) {
            window.location.href = response.url;
        }

    } catch (error) {
        console.error('Error logging out', error) // Log an error message to the console
        displayText("Error logging out") // Display error message
    }
}


// //------------------------------------------------------------------------------

// // Event Listeners
// // Had to do this for scoping reasons
// document.addEventListener('DOMContentLoaded', () => {
//     const notesMenu = document.getElementById('notesMenu') // Get the element with ID 'notesMenu'
//     const noteContentTextarea = document.getElementById('noteContent') // Get the element with ID 'noteContent'
//     const noteTitleArea = document.getElementById('noteTitle') // Get the element with ID 'noteTitle'
//     const noteidArea = document.getElementById('noteID') // Get the element with ID 'noteID'
//     const noteDateArea = document.getElementById('noteDate') // Get the element with ID 'noteDate'
//     const useridArea = document.getElementById('userID') // Get the element with ID 'userID'
//     const userDateArea = document.getElementById('lastLogin') // Get the element with ID 'userDate'

//     //--------------------------------------------------------------------------------
//     //Do this when adding auth checking
//     //Function to load User info
//     // async function fetchUserInfo() {
//     //     try {
//     //         const response = await fetch('/auth/users'); // Send a GET request to the API endpoint for fetching user info
//     //         if (!response.ok) {
//     //             throw new Error('Failed to Fetch User Info. !response throw', error) // Throw an error if the response is not ok
//     //         }
//     //         const user = await response.json(); // Parse the response as JSON

//     //         useridArea.innerHTML = user._id // Display user ID in ID area
//     //         userDateArea.innerHTML = user.lastLogin // Display user last login in date area
//     //     } catch (error) {
//     //         console.error('Error fetching user info:', error) // Log an error message to the console
//     //     }
//     // }
//     //--------------------------------------------------------------------------------


//     // Function to fetch notes from backend and populate notesMenu
//     async function fetchNotes() {
//         try {
//             const response = await fetch('/notes'); // Send a GET request to the API endpoint for fetching notes
//             if (!response.ok) {
//                 throw new Error('Failed to Fetch Notes. !response throw', error) // Throw an error if the response is not ok
//             }
//             const notes = await response.json(); // Parse the response as JSON
//             console.log('Notes:', notes) // Log notes
//             if (!notes) {
//                 console.log('No notes found') // Log notes
//                 throw new Error('No notes found', error) // Throw an error if no notes are found
//             }

//             // Clear notesMenu before populating it
//             notesMenu.innerHTML = '';

//             notes.forEach(note => {
//                 const li = document.createElement('li') // Create a new <li> element
//                 li.classList.add('mb-2') // Add the class 'mb-2' to the <li> element
//                 const a = document.createElement('a') // Create a new <a> element
//                 a.href = '#' // Set the href attribute of the <a> element to '#'
//                 a.classList.add('block', 'text-purple-900', 'bg-darkGray-100', 'hover:text-purple-300') // Add classes to the <a> element
//                 a.textContent = note.title // Set the text content of the <a> element to the note title
//                 a.dataset.noteId = note._id // Store note ID as a data attribute
//                 a.addEventListener('click', handleNoteClick) // Add a click event listener to the <a> element
//                 li.appendChild(a) // Append the <a> element to the <li> element
//                 notesMenu.appendChild(li) // Append the <li> element to the notesMenu
//             })
//         } catch (error) {
//             console.error('Error fetching notes:', error) // Log an error message to the console
//         }
//     }

//     async function handleNoteClick(event) {
//         const noteId = event.target.dataset.noteId; // Get the note ID from the data attribute of the clicked element
//         try {
//             const response = await fetch(`/notes/${noteId}`) // Send a GET request to the API endpoint for fetching a specific note
//             if (!response.ok) {
//                 throw new Error('Error fetching response from /notes/${noteid}') // Throw an error if the response is not ok
//             }
//             const note = await response.json(); // Parse the response as JSON
//             noteTitleArea.value = note.title; // Display note title in title area
//             noteContentTextarea.value = note.content // Display note content in textarea
//             noteidArea.dataset.noteId = note._id // Store note ID as a data attribute
//             noteidArea.innerHTML = note._id // Display note ID in ID area
//             currentNoteID = note._id // Update current note ID
//             console.log(`noteId: ${noteId}`, note) // Log note details (optional)

//             // Date manipulation
//             const date = new Date(note.createDate) // Convert note creation date to Date object
//             const localDate = date.toLocaleDateString() // Display note creation date in date area
//             const localTime = date.toLocaleTimeString() // Display note creation time in date area
//             noteDateArea.innerHTML = `${localDate} at ${localTime}` // Display note creation date in date area
//         } catch (error) {
//             console.error('Error fetching note details:', error) // Log an error message to the console
//         }
//     }
//     //fetchUserInfo(); // Fetch user info when the page loads
//     fetchNotes();  // Fetch notes when the page loads

//     // New button
//     const newButton = document.getElementById('newButton')
//     if (newButton) {
//         newButton.addEventListener('click', async () => {
//             await newNote()
//             await fetchNotes()
//             clearText()
//         });
//     }

//     // Save button
//     const saveButton = document.getElementById('saveButton')
//     if (saveButton) {
//         saveButton.addEventListener('click', async () => {
//             await saveNote()
//             await fetchNotes()
//         });
//     }

//     // Delete button
//     const deleteButton = document.getElementById('deleteButton')
//     if (deleteButton) {
//         deleteButton.addEventListener('click', async () => {
//             await deleteNote()
//             await fetchNotes()
//             clearText()
//         });
//     }

//     // Logout button
//     const logoutButton = document.getElementById('logoutButton')
//     if (logoutButton) {
//         logoutButton.addEventListener('click', async () => {
//             await logout()
//             console.log('User logged out') // Log a message to the console
//         });
//     }
// });