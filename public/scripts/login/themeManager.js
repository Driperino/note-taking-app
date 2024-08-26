// themeManager.js

export function applyTheme(preferredTheme) {
    document.documentElement.setAttribute('data-theme', preferredTheme);
    localStorage.setItem('theme', preferredTheme);
}

export function initializeTheme(toggle) {
    const preferredTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', preferredTheme);
    toggle.checked = preferredTheme === 'dark';

    toggle.addEventListener('change', (event) => {
        const newTheme = event.target.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    });
}
