const API_URL = "http://localhost:3000" // API URL for the backend server

const notesMenu = document.getElementById('notesMenu') // Get the element with ID 'notesMenu'
const noteContentTextarea = document.getElementById('noteContent') // Get the element with ID 'noteContent'
const noteTitleArea = document.getElementById('noteTitle') // Get the element with ID 'noteTitle'
const noteidArea = document.getElementById('noteID') // Get the element with ID 'noteID'
const noteDateArea = document.getElementById('noteDate') // Get the element with ID 'noteDate'
const useridArea = document.getElementById('userID') // Get the element with ID 'userID'
const sessionIDArea = document.getElementById('sessionID') // Get the element with ID 'sessionID'
const settingsArea = document.getElementById('settings') // Get the element with ID 'settings'



// This Variable NEEDS to be set BEFORE saving a note, otherwise it will not work
let currentNoteID = 'false' // Current note ID, initially set to 'false'
let loggedInUser = 'false' // Current user, initially set to 'false'

// Display *temporary* confirmation text function
function displayText(text) {
    const statusText = document.getElementById('noteStatus') // Get the element with ID 'noteStatus'
    statusText.innerHTML = text // Set the innerHTML of the element to the provided text
    setTimeout(function () { statusText.innerHTML = "" }, 3000) // Clear the text after 3 seconds
}

//Clear text fields and reset currentNoteID
function clearFieldsMain() {
    document.getElementById('noteTitle').value = '' // Clear the value of the element with ID 'noteTitle'
    document.getElementById('noteContent').value = '' // Clear the value of the element with ID 'noteContent'
    currentNoteID = '' // Reset currentNoteID to an empty string
    document.getElementById('noteID').innerHTML = '' // Clear the innerHTML of the element with ID 'noteID'
    document.getElementById('noteID').dataset.noteId = '' // Clear the data attribute 'noteId' of the element with ID 'noteID'
    document.getElementById('noteDate').innerHTML = '' // Clear the innerHTML of the element with ID 'noteDate'
}

// Clear text fields and reset currentNoteID
function clearFields(container) {
    const inputs = container.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.value = '';
        input.innerHTML = '';
    });
}

//------ API Functions -----------------------------------------------------------------

async function newNote() {
    if (currentNoteID) { // Check if currentNoteID is truthy (not empty or false)
        //I want to make a good looking confirmation box but this will do for now...
        if (confirm("You have a note open, would you still like to create a new note?")) { // Show a confirmation dialog
            displayText("New Note Created") // Display confirmation text
        } else {
            console.log("User chose not to create a new note") // Log a message to the console
        }
    }
}

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
                content: noteContent,
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
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;

    const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: noteTitle,
            content: noteContent
        }),
        credentials: 'include' // Ensure credentials are included
    });

    if (response.ok) {
        const note = await response.json();
        console.log('Note created:', note);
        displayText(`${note.title} created`);
    } else {
        console.error('Failed to create note:', response.status, response.statusText);
        displayText('Failed to create note');
    }
}

// Delete Note function
async function deleteNote() {
    if (currentNoteID) { // Check if currentNoteID is truthy (not empty or false)
        try {
            const noteTitle = document.getElementById('noteTitle').value // Get the value of the element with ID 'noteTitle'
            const noteContent = document.getElementById('noteContent').value // Get the value of the element with ID 'noteContent'
            const response = await fetch(`${API_URL}/notes/${currentNoteID}`, { // Send a DELETE request to the API endpoint for deleting a note
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
            displayText(`${noteTitle} deleted`) // Display confirmation text
        } catch (error) {
            console.error(`Error deleting Note ${noteTitle}`, error) // Log an error message to the console
            displayText("Error deleting note") // Display error message
        }
    } else {
        displayText("No note to delete") // Display message
        console.log("No note to delete") // Log a message to the console
    }
}

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


//------------------------------------------------------------------------------

// Function to load User info
async function fetchUserInfo() {
    try {
        const response = await fetch('/auth/user'); // Send a GET request to the API endpoint for fetching user info
        if (!response.ok) {
            throw new Error('Failed to fetch user info'); // Throw an error if the response is not ok
        }
        const user = await response.json(); // Parse the response as JSON

        loggedInUser = user.username; // Store the username in a global variable
        useridArea.innerHTML = user.id; // Display user ID in ID area
        sessionIDArea.innerHTML = user.sessionID; // Display session ID in session ID area
        if (user.email) {
            document.getElementById('userEmail').innerHTML = user.email; // Display email in email area
        }
    } catch (error) {
        console.error('Error fetching user info:', error); // Log an error message to the console
        displayText("Error fetching user info"); // Display error message
    }
}

// Function to fetch notes from backend and populate notesMenu
async function fetchNotes() {
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
            displayText("No notes found") // Display error message
        }

        // Clear notesMenu before populating it
        notesMenu.innerHTML = '';

        notes.forEach(note => {
            const li = document.createElement('li') // Create a new <li> element
            li.classList.add('mb-2') // Add the class 'mb-2' to the <li> element
            const a = document.createElement('a') // Create a new <a> element
            a.href = '#' // Set the href attribute of the <a> element to '#'
            a.classList.add('block', 'text-purple-900', 'bg-darkGray-100', 'hover:text-purple-300') // Add classes to the <a> element
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
async function selectNote(event) {
    const noteId = event.target.dataset.noteId; // Get the note ID from the data attribute of the clicked element
    try {
        const response = await fetch(`/notes/${noteId}`); // Send a GET request to fetch a specific note
        if (!response.ok) {
            throw new Error(`Error fetching response from /notes/${noteId}`); // Throw an error if the response is not ok
        }
        const note = await response.json(); // Parse the response as JSON

        // Assuming these elements are defined correctly in your HTML or script
        noteTitleArea.value = note.title; // Display note title in title area
        noteContentTextarea.value = note.content; // Display note content in textarea
        noteidArea.dataset.noteId = note._id; // Store note ID as a data attribute
        noteidArea.innerHTML = note._id; // Display note ID in ID area
        currentNoteID = note._id; // Update current note ID
        console.log(`noteId: ${noteId}`, note); // Log note details (optional)

        // Date manipulation
        const date = new Date(note.createDate); // Convert note creation date to Date object
        const localDate = date.toLocaleDateString(); // Display note creation date in date area
        const localTime = date.toLocaleTimeString(); // Display note creation time in date area
        noteDateArea.innerHTML = `${localDate} at ${localTime}`; // Display note creation date in date area
    } catch (error) {
        console.error('Error fetching note details:', error); // Log an error message to the console
    }
}

fetchUserInfo(); // Fetch user info when the page loads
fetchNotes();  // Fetch notes when the page loads

// Settings Menu 
// Update Username function
async function updateUsername() {
    const username = document.getElementById('updateUsername').value; // Get the value of the element with ID 'username'
    try {
        if (!username) {
            throw new Error('Username cannot be empty') // Throw an error if the username is empty
        } else if (username.length < 3) {
            throw new Error('Username must be at least 3 characters') // Throw an error if the username is less than 3 characters
        } else if (username === loggedInUser) {
            throw new Error('Username must be different from current username') // Throw an error if the username is the same as the current username
        }

        const response = await fetch('/auth/username', { // Send a PATCH request to the API endpoint for updating the username
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username
            })
        })

        if (response.ok) {
            console.log('Username updated') // Display confirmation text
            loggedInUser = username; // Update the global variable for the username
            //TODO Add a confirmation message
        } else {
            throw new Error('Failed to update username') // Throw an error if the response is not ok
        }
    } catch (error) {
        console.error('Error updating username:', error) // Log an error message to the console
    }
}

// Update Password function
async function updatePassword() {
    const newPassword = document.getElementById('newPassword').value; // Get the value of the element with ID 'password'
    const oldPassword = document.getElementById('oldPassword').value; // Get the value of the element with ID 'oldPassword'
    const confirmPassword = document.getElementById('confirmPassword').value; // Get the value of the element with ID 'confirmPassword'

    try {

        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match') // Throw an error if the new password and confirm password do not match
        } else if (newPassword === oldPassword) {
            throw new Error('New password must be different from old password') // Throw an error if the new password is the same as the old password
        } else if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters') // Throw an error if the new password is less than 8 characters
        }

        const response = await fetch('/auth/password', { // Send a PATCH request to the API endpoint for updating the password
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: newPassword
            })
        })

        if (response.ok) {
            console.log('Password updated') // Display confirmation text
            //TODO Add a confirmation message
        } else {
            throw new Error('Failed to update password') // Throw an error if the response is not ok
        }
    } catch (error) {
        console.error('Error updating password:', error) // Log an error message to the console
    }
}

// Update Email function
async function updateEmail() {
    const email = document.getElementById('updateEmail').value; // Get the value of the element with ID 'email'
    try {
        const response = await fetch('/auth/email', { // Send a PATCH request to the API endpoint for updating the email
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        })

        if (response.ok) {
            console.log('Email updated') // Display confirmation text
            //TODO Add a confirmation message
        } else {
            throw new Error('Failed to update email') // Throw an error if the response is not ok
        }
    } catch (error) {
        console.error('Error updating email:', error) // Log an error message to the console
    }
}

// Delete User function
async function deleteUser() {
    try {

        //TODO Wrap this in a confirmation box!!!!
        const response = await fetch('/auth/user', { // Send a DELETE request to the API endpoint for deleting the user
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            console.log('User deleted') // Display confirmation text
            //TODO Add a confirmation message
            await logout(); // Call the logout function
        } else {
            throw new Error('Failed to delete user') // Throw an error if the response is not ok
        }
    } catch (error) {
        console.error('Error deleting user:', error) // Log an error message to the console
    }
}

//--------------------------------------------------------------------------------------------
//Buttons

// New Note button
const newButton = document.getElementById('newButton')
if (newButton) {
    newButton.addEventListener('click', async () => {
        await newNote();
        await fetchNotes();
        await fetchUserInfo();
        clearFieldsMain();
    });
}

// Save Note button
const saveButton = document.getElementById('saveButton')
if (saveButton) {
    saveButton.addEventListener('click', async () => {
        if (currentNoteID === 'false' || currentNoteID === '') {
            await createNote();
            await fetchNotes();
            await fetchUserInfo();
        } else {
            await saveNote();
            await fetchNotes();
            await fetchUserInfo();
        }
    });
}

// Delete Note button
const deleteButton = document.getElementById('deleteButton')
if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
        await deleteNote();
        await fetchNotes();
        await fetchUserInfo();
        clearFieldsMain();
    });
}

// Logout button
const logoutButton = document.getElementById('logoutButton')
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        await logout();
        console.log('User logged out'); // Log a message to the console
    });
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

// Settings dropdown Menu button

document.getElementById('settingsButton').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings'); // Get the element with ID 'settingsMenu'
    const main = document.getElementById('main'); // Get the element with ID 'main'

    if (settingsMenu.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        settingsMenu.classList.remove('hidden'); // Remove the class 'hidden' from the element
        main.classList.add('hidden'); // Add the class 'hidden' to the element
    }
});

// Close dropdown Settings Menu button

document.getElementById('closeSettings').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings'); // Get the element with ID 'settingsMenu'
    const main = document.getElementById('main'); // Get the element with ID 'main'

    if (main.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        settingsMenu.classList.add('hidden'); // Remove the class 'hidden' from the element
        main.classList.remove('hidden'); // Add the class 'hidden' to the element
    }
});

// Settings Page buttons

// Update Username button
document.getElementById('updateUsernameButton').addEventListener('click', async function () {
    //TODO: Add a confirmation message
    await updateUsername(); // Call the updateUsername function
    clearFields(settingsArea); // Call the clearFields function

});

// Update email button
document.getElementById('updateEmailButton').addEventListener('click', async function () {
    //TODO: Add a confirmation message
    await updateEmail(); // Call the updateEmail function
    clearFields(settingsArea); // Call the clearFields function
});

// Update Password button
document.getElementById('changePasswordButton').addEventListener('click', async function () {
    //TODO: Add a confirmation message
    await updatePassword(); // Call the updatePassword function
    clearFields(settingsArea); // Call the clearFields function
});

// Delete User button
document.getElementById('confirmDeleteButton').addEventListener('click', async function () {
    //TODO: Add a confirmation message
    await deleteUser(); // Call the deleteUser function
    clearFields(settingsArea); // Call the clearFields function
});
//---------------------------------------------------------------------------------------------
