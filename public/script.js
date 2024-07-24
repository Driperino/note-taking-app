// Global variables
const API_URL = "http://localhost:3000" // API URL for the backend server
const notesMenu = document.getElementById('notesMenu') // Get the element with ID 'notesMenu'
const noteContentTextarea = document.getElementById('noteContent') // Get the element with ID 'noteContent'
const noteTitleArea = document.getElementById('noteTitle') // Get the element with ID 'noteTitle'
const noteDateArea = document.getElementById('noteDate') // Get the element with ID 'noteDate'
const settingsArea = document.getElementById('settings') // Get the element with ID 'settings'
const infoBoxUsername = document.getElementById('infoBoxUsername') // Get the element with ID 'infoBoxUsername'
const loggedInEmailArea = document.getElementById('userEmail') // Get the element with ID 'loggedInEmail';
const loggedInUserSettingsArea = document.getElementById('userCurrentUser') // Get the element with ID 'loggedInUserSettings'
const themeToggle = document.getElementById('dark-toggle');// Get the element with ID 'dark-toggle'
let currentNoteID = '' // Current note ID, initially set to 'false'
let loggedInUser = '' // Current user, initially set to 'false'
let loggedInEmail = '' // Current email, initially set to 'false'
let preferredTheme = localStorage.getItem('theme') || 'light' // Get the preferred theme from local storage or set to 'light'
document.documentElement.setAttribute('data-theme', preferredTheme) // Set the theme based on the preferred theme
themeToggle.checked = preferredTheme === 'dark' // Set the theme toggle based on the preferred theme
//--------------------------------------------------------------------------------------------

// Check if the user has a preferred color scheme 
// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//     preferredTheme = 'dark';
// } else {
//     preferredTheme = 'light';
// }

// Display *temporary* confirmation text function
function displayText(text) {
    const statusText = document.getElementById('noteStatus') // Get the element with ID 'noteStatus'
    statusText.innerHTML = text // Set the innerHTML of the element to the provided text
    setTimeout(function () { statusText.innerHTML = "" }, 5000) // Clear the text after 5 seconds
    console.log('Main Status text displayed') // Log a message to the console
}

function displayTextSettings(text) {
    const statusText = document.getElementById('settingsStatus') // Get the element with ID 'settingsStatus'
    statusText.innerHTML = text // Set the innerHTML of the element to the provided text
    setTimeout(function () { statusText.innerHTML = "" }, 5000) // Clear the text after 5 seconds

    console.log('Settings Status text displayed') // Log a message to the console
}
//Clear text fields
function clearFieldsMain() {
    noteTitleArea.value = '' // Clear the value of the element with ID 'noteTitle'
    noteContentTextarea.value = '' // Clear the value of the element with ID 'noteContent'
    noteDateArea.innerHTML = '' // Clear the innerHTML of the element with ID 'noteDate'
    console.log('Main Fields cleared') // Log a message to the console
}

// Clear text fields
function clearFields(container) {
    const inputs = container.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.value = '';
        input.innerHTML = '';
    });

    console.log('Fields cleared');
}
// confirmation box function
function customConfirm(message, callback) {
    console.log("Creating custom Confirm Box");
    // Select elements
    const overlay = document.getElementById('confirm-overlay');
    const modal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const cancelButton = document.getElementById('cancel-button');
    const okButton = document.getElementById('ok-button');

    // Set message
    modalMessage.textContent = message;

    // Show the modal and overlay
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');

    // Add blur effect to main content
    document.body.classList.add('modal-open');

    // Event listeners for buttons
    cancelButton.onclick = function () {
        overlay.classList.add('hidden');
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        callback(false);
    };

    okButton.onclick = function () {
        overlay.classList.add('hidden');
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        callback(true);
    };
}
//------ API Functions -----------------------------------------------------------------
// New Note function
async function newNote() {
    if (currentNoteID) { // Check if currentNoteID is truthy (not empty or false)

        console.log("User chose to create a new note");
        displayText("New Note Created"); // Display confirmation text
        clearFieldsMain(); // Clear text fields and reset currentNoteID
        currentNoteID = 'false'; // Reset currentNoteID to 'false'

    } else {
        // Add an expression here
        displayText("New Note Created"); // Display confirmation text
        clearFieldsMain(); // Clear text fields and reset currentNoteID
        currentNoteID = 'false'; // Reset currentNoteID to 'false'
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
            credentials: 'include' // Ensure credentials are included
        });

        if (response.ok) {
            const note = await response.json();
            console.log('Note created:', note);
            displayText(`${note.title} created`);
            // Assign the ID of the created note to currentNoteID
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

// Function to load User info - Username, Theme, Email
async function fetchUserInfo() {
    try {
        const response = await fetch('/auth/user'); // Send a GET request to the API endpoint for fetching user info
        console.log(`fetching user info`);
        if (!response.ok) {
            throw new Error('Failed to fetch user info'); // Throw an error if the response is not ok
        }
        const user = await response.json(); // Parse the response as JSON
        if (user) {
            console.log(`user info fetched`);
            console.log(user); // Log user info
            loggedInUser = user.username; // Store the username in a global variable
            infoBoxUsername.innerHTML = user.username; // Display username in username area
            loggedInUserSettingsArea.innerHTML = user.username; // Display username in settings area
            preferredTheme = user.theme; // Store the theme in a global variable
            if (user.email) {
                loggedInEmail = user.email; // Store the email in a global variable
                loggedInEmailArea.innerHTML = user.email; // Display email in email area
                console.log(`User Email fetched ${loggedInEmail}`); // Log user info
            }
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
            //displayText("No notes found") // Display error message UNREACHABLE //TODO FIX
        }

        // Clear notesMenu before populating it
        notesMenu.innerHTML = '';

        notes.forEach(note => {
            const li = document.createElement('li') // Create a new <li> element
            li.classList.add('mb-2') // Add the class 'mb-2' to the <li> element
            const a = document.createElement('a') // Create a new <a> element
            a.href = '#' // Set the href attribute of the <a> element to '#'
            a.classList.add('block', 'text-text', 'bg-background', 'hover:text-secondary') // Add classes to the <a> element
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
        console.log(`noteId: ${noteId}`, note); // Log note details (optional)

        currentNoteID = note._id; // Update current note ID
        // Date manipulation
        const date = new Date(note.createDate); // Convert note creation date to Date object
        const localDate = date.toLocaleDateString(); // Display note creation date in date area
        const localTime = date.toLocaleTimeString(); // Display note creation time in date area
        noteDateArea.innerHTML = `${localDate} at ${localTime}`; // Display note creation date in date area
    } catch (error) {
        console.error('Error fetching note details:', error); // Log an error message to the console
    }
}
//------------------------------------------------------------------------------
//On page load functions
document.addEventListener('DOMContentLoaded', function () {

    fetchUserInfo(); // Fetch user info when the page loads
    fetchNotes();  // Fetch notes when the page loads

    // Set the theme based on the user's preference
    if (preferredTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('dark-toggle').checked = true;
        console.log('Theme set to:', preferredTheme);
    } else if (preferredTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('dark-toggle').checked = false;
        console.log('Theme set to:', preferredTheme);
    }
});




// Settings Menu -----------------------------------------------------------------
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
            displayTextSettings(`Username updated to ${loggedInUser}`); // Display confirmation text
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
        const response = await fetch('/auth/user', { // Send a DELETE request to the API endpoint for deleting the user
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            console.log('User deleted') // Display confirmation text
            await logout(); // Call the logout function
        } else {
            throw new Error('Failed to delete user') // Throw an error if the response is not ok
        }
    } catch (error) {
        console.error('Error deleting user:', error) // Log an error message to the console
    }
}

//save theme function
async function saveTheme() {
    try {
        const response = await fetch('/auth/theme', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                theme: preferredTheme
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error updating theme:', error);
    }
}

//--------------------------------------------------------------------------------------------

//Buttons and Event Listeners
// New Note button
const newButton = document.getElementById('newButton')
if (newButton) {
    newButton.addEventListener('click', async () => {
        if (noteTitleArea.value || noteContentTextarea.value) {
            customConfirm(`Are you sure you want to create a new note?`, async function (result) {
                if (result) {
                    console.log("User chose to create a new note");
                    newButton.addEventListener('click', async () => {
                        await newNote();
                        await fetchNotes();
                        await fetchUserInfo();
                        clearFieldsMain();
                    });
                } else {
                    console.log("User chose not to create a new note");
                }
            });
        } else {
            console.log("User chose to create a new note");
            await newNote();
            await fetchNotes();
            await fetchUserInfo();
            clearFieldsMain();
        }
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
        if (currentNoteID === 'false' || currentNoteID === '') {
            displayText("No note to delete");
            console.log("No note to delete");
        } else {
            customConfirm(`Are you sure you want to delete this note?`, async function (result) {
                if (result) {
                    try {
                        await deleteNote();
                        await fetchNotes();
                        await fetchUserInfo();
                        clearFieldsMain();
                    } catch {
                        console.log("User chose not to delete note");
                    }

                } else {
                    console.log("User chose not to delete note");
                }
            });
        }
    });
}

// Logout button
const logoutButton = document.getElementById('logoutButton')
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        customConfirm(`Are you sure you want to log out?`, async function (result) {
            if (result) {
                console.log("User chose to log out");
                await logout();
            } else {
                console.log("User chose not to log out");
            }
        });
    });
}

// Expanding menus -----------------------------------------------------------------
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


    if (settingsMenu.classList.contains('hidden')) { // Check if the element has the class 'hidden'
        settingsMenu.classList.toggle('hidden'); // Remove the class 'hidden' from the element
    }
});

// Close dropdown Settings Menu button

document.getElementById('closeSettings').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings'); // Get the element with ID 'settingsMenu'

    settingsMenu.classList.toggle('hidden'); // Remove the class 'hidden' from the element
});

// Settings Page buttons ---------------------------------------------------------------

// Update Username button
document.getElementById('updateUsernameButton').addEventListener('click', async function () {
    customConfirm(`Are you sure you want to update your username?`, async function (result) {
        if (result) { // Proceed if the user confirms
            try {
                await updateUsername(); // Call the updateUsername function
                clearFields(settingsArea); // Call the clearFields function
                displayTextSettings("Username updated successfully"); // Display confirmation text
            }
            catch (error) {
                console.error("Error updating username:", error);
            }
        } else {
            console.log("User chose not to update username");
        }
    });
});

// Update email button
document.getElementById('updateEmailButton').addEventListener('click', async function () {
    customConfirm(`Are you sure you want to update your email?`, async function (result) {
        if (result) { // Proceed if the user confirms
            try {
                await updateEmail(); // Call the updateEmail function
                clearFields(settingsArea); // Call the clearFields function
                displayTextSettings("Email updated successfully"); // Display confirmation text
            }
            catch (error) {
                console.error("Error updating email:", error);
            }
        } else {
            console.log("User chose not to update email");
        }
    });
});

// Update Password button
document.getElementById('changePasswordButton').addEventListener('click', async function () {
    customConfirm(`Are you sure you want to change your password?`, async function (result) {
        if (result) { // Proceed if the user confirms
            try {
                await updatePassword(); // Call the updatePassword function
                clearFields(settingsArea); // Call the clearFields function
                displayTextSettings("Password updated successfully"); // Display confirmation text
            }
            catch (error) {
                console.error("Error updating password:", error);
            }
        } else {
            console.log("User chose not to change password");
        }
    });
});

// Delete User button
document.getElementById('confirmDeleteButton').addEventListener('click', async function () {
    customConfirm(`Are you sure you want to delete your account?`, async function (result) {
        if (result) { // Proceed if the user confirms
            try {
                await deleteUser(); // Call the deleteUser function
                clearFields(settingsArea); // Call the clearFields function
            }
            catch (error) {
                console.error("Error deleting user:", error);
            }
        } else {
            console.log("User chose not to delete account");
        }
    });
});
// theme switcher
themeToggle.addEventListener('change', async (event) => {
    if (event.target.checked) {
        preferredTheme = 'dark';
    } else {
        preferredTheme = 'light';
    }

    document.documentElement.setAttribute('data-theme', preferredTheme);
    localStorage.setItem('theme', preferredTheme);

    // Save the theme to the server
    await saveTheme();
});
//---------------------------------------------------------------------------------------------
