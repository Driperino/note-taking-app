// userAuth.js

import { displayText, displayTextSettings } from './uiInteractions.js';
import { API_URL } from './script.js';

export const loggedInUserSettingsArea = document.getElementById('userCurrentUser');
export let loggedInUser = '';

export const themeToggle = document.getElementById('dark-toggle');
export let loggedInEmail = '';

export const loggedInEmailArea = document.getElementById('userEmail');

export let preferredTheme = localStorage.getItem('theme') || 'light';

export async function logout() {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.redirected) {
            window.location.href = response.url;
        }

    } catch (error) {
        console.error('Error logging out', error);
        displayText("Error logging out");
    }
}

export async function fetchUserInfo() {
    try {
        const response = await fetch('/auth/user');
        console.log(`fetching user info`);
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const user = await response.json();
        if (user) {
            console.log(`user info fetched`);
            console.log(user);
            loggedInUser = user.username;
            loggedInUserSettingsArea.innerHTML = user.username;
            preferredTheme = user.theme;

            document.documentElement.setAttribute('data-theme', preferredTheme);
            themeToggle.checked = preferredTheme === 'dark';
            localStorage.setItem('theme', preferredTheme);

            if (user.email) {
                loggedInEmail = user.email;
                loggedInEmailArea.innerHTML = user.email;
                console.log(`User Email fetched ${loggedInEmail}`);
            }
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        displayText("Error fetching user info");
    }
}

export async function updateUsername() {
    const username = document.getElementById('updateUsername').value;

    try {
        if (!username) {
            throw new Error('Username cannot be empty');
        } else if (username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        } else if (username === loggedInUser) {
            throw new Error('Username must be different from current username');
        }

        const response = await fetch('/auth/username', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (response.status === 200) {
            console.log('Username updated');
            loggedInUser = username;
            loggedInUserSettingsArea.innerHTML = username;
            displayTextSettings(`Username updated to ${loggedInUser}`);
        }
        if (response.status === 400) {
            console.log('Username already exists');
            displayTextSettings('Username already exists');
        }
    } catch (error) {
        console.error('Error updating username:', error.message);
        displayTextSettings(error.message);
    }
}

export async function updatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        } else if (newPassword === oldPassword) {
            throw new Error('New password must be different from old password');
        } else if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        const response = await fetch('/auth/password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: newPassword
            })
        });

        if (response.ok) {
            console.log('Password updated');
        } else {
            throw new Error('Failed to update password');
        }
    } catch (error) {
        console.error('Error updating password:', error);
        displayTextSettings(error.message);
    }
}

export async function updateEmail() {
    const email = document.getElementById('updateEmail').value;
    try {
        const response = await fetch('/auth/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        });

        if (response.ok) {
            console.log('Email updated');
            loggedInEmail = email;
            loggedInEmailArea.innerHTML = email;
            displayTextSettings("Email updated successfully");
        } else {
            throw new Error('Failed to update email');
        }
    } catch (error) {
        console.error('Error updating email:', error);
        displayTextSettings(error.message);
    }
}

export async function deleteUser() {
    try {
        const response = await fetch('/auth/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('User deleted');
            await logout();
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        displayTextSettings(error.message);
    }
}


export async function saveTheme(theme) {
    try {
        const response = await fetch(`${API_URL}/auth/theme`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                theme
            }),
            credentials: 'include'
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