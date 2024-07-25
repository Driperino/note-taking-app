// script.js

import { initializeLogin } from './login.js';
import { initializeRegister } from './register.js';
import { initializeTheme } from './themeManager.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
    initializeRegister();

    const themeToggle = document.getElementById('dark-toggle');
    initializeTheme(themeToggle);
});
