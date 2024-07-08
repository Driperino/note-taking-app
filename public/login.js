// Selectors
// Define the initial view as 'main'
let view = 'main';
console.log(`${view} is the Current View`)

// Function to change the view based on the input
function changeView(view) {
    // If the view is 'login'
    if (view === 'login') {
        // Show the login view
        document.getElementById(view).classList.toggle('hidden');
        console.log(`${view} is now visible`);
        // Hide the main view
        document.getElementById("main").classList.toggle('hidden');
        console.log(`Main is now hidden`);
    }

    // If the view is 'register'
    if (view === 'register') {
        // Show the register view
        document.getElementById(view).classList.toggle('hidden');
        console.log(`${view} is now visible`);
        // Hide the main view
        document.getElementById("main").classList.toggle('hidden');
        console.log(`Main is now hidden`);
    }

    // If the view is 'main'
    if (view === 'main') {
        // Show the main view
        document.getElementById('main').classList.toggle('hidden');
        console.log(`main is now visible`);
        // Hide the login view
        document.getElementById("login").classList.toggle('hidden');
        console.log(`login is now hidden`);
        // Hide the register view
        document.getElementById("register").classList.toggle('hidden');
        console.log(`register is now hidden`);
    }

    // If the view is 'reset'
    if (view === 'reset') {
        // Show the main view
        document.getElementById('main').classList.remove('hidden');
        console.log(`main is now visible`);
        // Hide the login view
        document.getElementById("login").classList.add('hidden');
        console.log(`login is now hidden`);
        // Hide the register view
        document.getElementById("register").classList.add('hidden');
        console.log(`register is now hidden`);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Get the login selector button element
    const loginSelectorButton = document.getElementById('loginSelectButton');
    // Get the register selector button element
    const registerSelectorButton = document.getElementById('registerSelectButton');
    // Get the reset selector button element
    const resetSelectorButtonOne = document.getElementById('backButton');
    const resetSelectorButtonTwo = document.getElementById('backButtonTwo');

    // Add click event listener to the login selector button
    loginSelectorButton.addEventListener('click', () => {
        view = 'login';
        console.log(`${view} selected`)
        changeView(view);
    });

    // Add click event listener to the register selector button
    registerSelectorButton.addEventListener('click', () => {
        view = 'register';
        console.log(`${view} selected`)
        changeView(view);
    });
    // Theese two need to be combined into one function later on :/
    // Event listener for resetSelectorButton
    resetSelectorButtonOne.addEventListener('click', () => {
        view = 'reset';
        console.log(`${view} selected`);
        changeView(view);
        // Clear all input forms
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    });

    // Event listener for resetSelectorButtonTwo (if it exists)
    if (resetSelectorButtonTwo) {
        resetSelectorButtonTwo.addEventListener('click', () => {
            view = 'reset';
            console.log(`${view} selected`);
            changeView(view);
            // Clear all input forms
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        });
    }
});
//API
const API_URL = 'http://localhost:3000';

document.getElementById('registerButton').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('Register button clicked');

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    console.log(`Username: ${username}, Password: ${password}`);

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.redirected) {
        window.location.href = response.url;
    }

    if (response.status >= 400) {
        const data = await response.text();
        console.log(data);
    } else {
        console.log("User registered successfully");
    }
});


document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('Login button clicked');

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username || password) {
        console.log(`Username: ${username}, Password: ${password}`);//REMOVE THIS ONCE IT'S WORKING!!!!!!!!!!!!!!
    }

    if (!username || !password) {
        console.log('Please provide a username and password');
        return;
    } else {
        console.log(`Username: ${username}, Password: ${password}`);//REMOVE THIS ONCE IT'S WORKING!!!!!!!!!!!!!!
    }

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    // if (response.redirected) {
    //     window.location.href = response.url;
    // }

    if (response >= 400) {
        const data = await response.text();
        console.log(`Error: ${data}`);
        document.getElementById('loginUsername').innerHTML = '';
        document.getElementById('loginPassword').innerHTML = '';
    }
});

