// viewManager.js

export let view = 'main';

export function changeView(view) {
    if (view === 'login') {
        document.getElementById(view).classList.toggle('hidden');
        document.getElementById("main").classList.toggle('hidden');
    }

    if (view === 'register') {
        document.getElementById(view).classList.toggle('hidden');
        document.getElementById("main").classList.toggle('hidden');
    }

    if (view === 'main') {
        document.getElementById('main').classList.toggle('hidden');
        document.getElementById("login").classList.toggle('hidden');
        document.getElementById("register").classList.toggle('hidden');
    }

    if (view === 'reset') {
        document.getElementById('main').classList.remove('hidden');
        document.getElementById("login").classList.add('hidden');
        document.getElementById("register").classList.add('hidden');
    }
}
