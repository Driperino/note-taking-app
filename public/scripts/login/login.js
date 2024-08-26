import { changeView } from './viewManager.js'; // Remove view from imports
import { loginUser } from './api.js';

let view = 'main'; // Define view as a reassignable variable within this module

export function initializeLogin() {
    const loginSelectorButton = document.getElementById('loginSelectButton');
    const loginButton = document.getElementById('loginButton');
    const resetSelectorButtonOne = document.getElementById('backButton');
    const resetSelectorButtonTwo = document.getElementById('backButtonTwo');
    const googleLoginButton = document.getElementById('loginGoogleButton');
    const githubLoginButton = document.getElementById('loginGithubButton');

    loginSelectorButton.addEventListener('click', () => {
        view = 'login';
        changeView(view);
    });

    loginButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const errorMessage = document.getElementById('loginError');

        if (password.length < 8) {
            errorMessage.innerHTML = "Password must be at least 8 characters long";
            return;
        }

        const response = await loginUser(username, password);
        if (response.status >= 400) {
            const data = await response.text();
            errorMessage.innerHTML = "Invalid username or password. Please try again.";
        } else {
            if (response.redirected) {
                window.location.href = response.url;
            }
        }
    });

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:3000/auth/${provider}`;
    };

    googleLoginButton.addEventListener('click', () => handleOAuthLogin('google'));
    githubLoginButton.addEventListener('click', () => handleOAuthLogin('github'));

    if (resetSelectorButtonOne) {
        resetSelectorButtonOne.addEventListener('click', () => {
            view = 'reset';
            changeView(view);
            clearInputForms();
        });
    }

    if (resetSelectorButtonTwo) {
        resetSelectorButtonTwo.addEventListener('click', () => {
            view = 'reset';
            changeView(view);
            clearInputForms();
        });
    }
}

function clearInputForms() {
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}
