import { changeView } from './viewManager.js'; // Remove view from imports
import { registerUser } from './api.js';

let view = 'main'; // Define view as a reassignable variable within this module

export function initializeRegister() {
    const registerSelectorButton = document.getElementById('registerSelectButton');
    const registerButton = document.getElementById('registerButton');

    registerSelectorButton.addEventListener('click', () => {
        view = 'register';
        changeView(view);
    });

    registerButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const errorMessage = document.getElementById('registerError');

        if (password.length < 8) {
            errorMessage.innerHTML = "Password must be at least 8 characters long";
            return;
        }

        const response = await registerUser(username, password);
        if (response.status >= 400) {
            const data = await response.text();
            errorMessage.innerHTML = "Username already exists. Please try again.";
        } else {
            if (response.redirected) {
                window.location.href = response.url;
            }
        }
    });
}