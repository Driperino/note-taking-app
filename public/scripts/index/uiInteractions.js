// uiInteractions.js
import { noteTitleArea, noteContentTextarea, noteDateAgeArea, noteDateArea } from "./noteOperations.js";

let hideTimeout;
let fadeTimeout;

// Error Modal
export function showErrorModal(message) {
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');

    // Clear existing timeouts
    if (hideTimeout) clearTimeout(hideTimeout);
    if (fadeTimeout) clearTimeout(fadeTimeout);

    // Update message and show modal
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden', 'opacity-0');
    errorModal.classList.add('opacity-100');

    // Set new timeouts
    fadeTimeout = setTimeout(() => {
        errorModal.classList.remove('opacity-100');
        errorModal.classList.add('opacity-0');
    }, 3000);

    hideTimeout = setTimeout(() => {
        errorModal.classList.add('hidden');
    }, 8000);
}


export function clearFieldsMain() {
    noteTitleArea.value = '';
    noteContentTextarea.value = '';
    noteDateArea.innerHTML = '';
    noteDateAgeArea.innerHTML = '';
    console.log('Main Fields cleared');
}

export function clearFields(container) {
    const inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        input.innerHTML = '';
    });
    console.log('Fields cleared');
}

export function closeAllDropdowns() {
    const menu = document.getElementById('menu');
    const notesMenu = document.getElementById('notesMenu');
    const settingsMenu = document.getElementById('settings');
    const sidebar = document.getElementById('sidebar');

    console.log('Closing all dropdowns');

    if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
    }
    if (!notesMenu.classList.contains('hidden')) {
        notesMenu.classList.add('hidden');
    }
    if (!settingsMenu.classList.contains('hidden')) {
        settingsMenu.classList.add('hidden');
    }
    if (!sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
    }
}

export function customConfirm(message, callback) {
    console.log("Creating custom Confirm Box");
    const overlay = document.getElementById('confirm-overlay');
    const modal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const cancelButton = document.getElementById('cancel-button');
    const okButton = document.getElementById('ok-button');

    modalMessage.textContent = message;
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

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

export function timeSince(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
}