// public/scripts/index/script.js
import {
    newNote,
    saveNote,
    createNote,
    deleteNote,
    fetchNotes,
    getNoteById,
    fetchVersions,
    clearVersionList,
    currentNoteID,
    noteTitleArea,
    noteContentTextarea,
    selectNote
} from './noteOperations.js';

import {
    logout,
    fetchUserInfo,
    updateUsername,
    updatePassword,
    updateEmail,
    deleteUser,
    saveTheme,
    preferredTheme
} from './userAuth.js';

import {
    clearFieldsMain,
    clearFields,
    customConfirm,
    closeAllDropdowns,
    showErrorModal
} from './uiInteractions.js';

// Global variables
export const API_URL = "http://localhost:3000";
export const notesMenu = document.getElementById('notesMenu');
export const settingsArea = document.getElementById('settings');
export const infoBoxUsername = document.getElementById('infoBoxUsername');

// Set initial theme
document.documentElement.setAttribute('data-theme', preferredTheme);
const themeToggle = document.getElementById('dark-toggle');
themeToggle.checked = preferredTheme === 'dark';

document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserInfo();
    await fetchNotes();

    // Check if there's a last loaded note ID in local storage
    let lastLoadedNoteId = localStorage.getItem('lastLoadedNoteId');

    if (!lastLoadedNoteId) {
        // If no note ID in local storage, check the server
        const response = await fetch('/users/last-loaded-note');
        if (response.ok) {
            const data = await response.json();
            lastLoadedNoteId = data.lastLoadedNoteId;
        }
    }

    if (lastLoadedNoteId) {
        // Simulate a click event to select the last loaded note
        const noteElement = document.querySelector(`[data-note-id="${lastLoadedNoteId}"]`);
        if (noteElement) {
            noteElement.click();
        } else {
            // Fallback to loading the note directly if the element is not found
            await selectNote({
                target: {
                    dataset: {
                        noteId: lastLoadedNoteId
                    }
                }
            });
        }
    }

    if (preferredTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        console.log('Theme set to:', preferredTheme);
    } else if (preferredTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
        console.log('Theme set to:', preferredTheme);
    }

    document.getElementById('newButton').addEventListener('click', async () => {
        if (noteTitleArea.value || noteContentTextarea.value) {
            customConfirm(`Are you sure you want to create a new note?`, async function (result) {
                if (result) {
                    await newNote();
                    await fetchNotes();
                    await fetchUserInfo();
                    clearFieldsMain();
                } else {
                    console.log("User chose not to create a new note");
                }
            });
        } else {
            await newNote();
            await fetchNotes();
            await fetchUserInfo();
            clearFieldsMain();
        }
    });

    document.getElementById('saveButton').addEventListener('click', async () => {
        try {
            if (currentNoteID === 'false' || currentNoteID === '') {
                await createNote();
            } else {
                await saveNote();
            }
            await getNoteById(currentNoteID);
            await fetchNotes();
            await fetchUserInfo();
            await fetchVersions(currentNoteID); // Fetch versions after saving
            console.log('Save button clicked, note updated');
        } catch (error) {
            console.error('Error handling save button click:', error);
        }
    });

    document.getElementById('deleteButton').addEventListener('click', async () => {
        if (currentNoteID === 'false' || currentNoteID === '') {
            showErrorModal("No note to delete");
            console.log("No note to delete");
        } else {
            customConfirm(`Are you sure you want to delete this note?`, async function (result) {
                if (result) {
                    await deleteNote();
                    await fetchNotes();
                    await fetchUserInfo();
                    clearFieldsMain();
                } else {
                    console.log("User chose not to delete note");
                }
            });
        }
    });

    document.getElementById('logoutButton').addEventListener('click', async () => {
        customConfirm(`Are you sure you want to log out?`, async function (result) {
            if (result) {
                await logout();
            } else {
                console.log("User chose not to log out");
            }
        });
    });

    document.getElementById('menuButton').addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.classList.toggle('hidden');
        console.log("Menu button clicked");
    });

    document.getElementById('notesButton').addEventListener('click', () => {
        const notesMenu = document.getElementById('notesMenu');
        notesMenu.classList.toggle('hidden');
        console.log("Notes button clicked");
    });

    document.getElementById('settingsButton').addEventListener('click', () => {
        const settingsMenu = document.getElementById('settings');
        settingsMenu.classList.toggle('hidden');
        console.log("Settings button clicked");
    });

    document.getElementById('closeSettings').addEventListener('click', async () => {
        const settingsMenu = document.getElementById('settings');
        settingsMenu.classList.toggle('hidden');
        const currentTheme = themeToggle.checked ? 'dark' : 'light';
        console.log("Saving theme on close settings:", currentTheme); // Debug statement
        try {
            await saveTheme(currentTheme);
            console.log("Theme saved successfully on close settings.");
        } catch (error) {
            console.error("Error saving theme on close settings:", error);
        }
        console.log("Close settings button clicked");
    });

    document.getElementById('updateUsernameButton').addEventListener('click', async () => {
        customConfirm(`Are you sure you want to update your username?`, async function (result) {
            if (result) {
                await updateUsername();
                clearFields(settingsArea);
            } else {
                console.log("User chose not to update username");
            }
        });
    });

    document.getElementById('updateEmailButton').addEventListener('click', async () => {
        customConfirm(`Are you sure you want to update your email?`, async function (result) {
            if (result) {
                await updateEmail();
                clearFields(settingsArea);
                showErrorModal("Email updated successfully");
            } else {
                console.log("User chose not to update email");
            }
        });
    });

    document.getElementById('changePasswordButton').addEventListener('click', async () => {
        customConfirm(`Are you sure you want to change your password?`, async function (result) {
            if (result) {
                await updatePassword();
                clearFields(settingsArea);
                showErrorModal("Password updated successfully");
            } else {
                console.log("User chose not to change password");
            }
        });
    });

    document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
        customConfirm(`Are you sure you want to delete your account?`, async function (result) {
            if (result) {
                await deleteUser();
                clearFields(settingsArea);
            } else {
                console.log("User chose not to delete account");
            }
        });
    });

    themeToggle.addEventListener('change', async (event) => {
        const newTheme = event.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        console.log("Saving theme on toggle change:", newTheme); // Debug statement
        try {
            await saveTheme(newTheme);
            console.log("Theme saved successfully on toggle change.");
        } catch (error) {
            console.error("Error saving theme on toggle change:", error);
        }
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const sidebar = document.getElementById('sidebar');

    const toggleSidebar = () => {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('flex');
        console.log("Mobile menu button clicked");
    };

    mobileMenuButton.addEventListener('click', toggleSidebar);

    // Mobile view buttons and responsive behavior
    const addMobileEventListeners = () => {
        const screenWidth = window.innerWidth;
        console.log("Checking screen width:", screenWidth);

        const noteButtons = document.querySelectorAll('#notesMenu li a');

        console.log('noteButtons:', noteButtons);

        const addNoteButtonListeners = () => {
            noteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('Note button clicked');
                    if (window.innerWidth <= 768) {
                        console.log('Closing all dropdowns');
                        closeAllDropdowns();
                    }
                });
            });
        };

        if (screenWidth <= 768) {
            if (mobileMenuButton && sidebar) {
                mobileMenuButton.removeEventListener('click', toggleSidebar);
                mobileMenuButton.addEventListener('click', toggleSidebar);
                console.log("Event listener added to mobileMenuButton");
            }

            addNoteButtonListeners();
        } else {
            if (sidebar) {
                sidebar.classList.remove('hidden');
                console.log("Sidebar shown on larger screens");
            }
        }
    };

    addMobileEventListeners();
    window.addEventListener('resize', addMobileEventListeners);
});
