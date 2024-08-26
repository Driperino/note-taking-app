// api.js

const API_URL = 'http://localhost:3000';

export async function registerUser(username, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return response;
}

export async function loginUser(username, password) {
    const date = new Date();
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, lastLogin: date })
    });

    return response;
}

export async function getTestUserInfo() {
    const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response;
}
