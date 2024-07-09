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
//API----------------------------------------------------------------------------------------------------------------
const API_URL = 'http://localhost:3000';

// Register button API 
document.getElementById('registerButton').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('Register button clicked');

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const errorMessage = document.getElementById('registerError');

    const minLen = 8;

    if (password.length < minLen) {
        console.log(`Password must be at least ${minLen} characters long`);
        errorMessage.innerHTML = "Password must be at least 8 characters long";
        return;
    }

    // Logging for debugging purposes ------------------------------------------------
    if (username || password) {
        console.log(`Username: ${username}, Password: ${password}`);//REMOVE THIS ONCE IT'S WORKING!!!!!!!!!!!!!!
    }
    if (!username || !password) {
        console.log('Please provide a username and password');
        return;
    } else {
        console.log(`Username: ${username}, Password: ${password}`);//REMOVE THIS ONCE IT'S WORKING!!!!!!!!!!!!!!
    }
    //--------------------------------------------------------------------------------

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })

    if (response.status >= 400) {
        const data = await response.text();
        console.log(`Error during register: ${data}`);
        errorMessage.innerHTML = "Username already exists. Please try again.";
    } else {
        console.log(`User ${username} registered successfully!`);
        if (response.redirected) {
            window.location.href = response.url;
            console.log(`redirecting to ${response.url}`)
        }
    }
});



// const response = await fetch(`${API_URL}/auth/register`, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, password })
// });

// if (response.redirected) {
//     window.location.href = response.url;
// }

// if (response.status >= 400) {
//     const data = await response.text();
//     console.log(data);
// } else {
//     console.log("User registered successfully");
// }

//Login Button API
document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('Login button clicked');

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const date = new Date();
    const errorMessage = document.getElementById('loginError');

    const minLen = 8;
    // Check if the password is at least 8 characters long
    if (password.length < minLen) {
        console.log(`Password must be at least ${minLen} characters long`);
        errorMessage.innerHTML = "Password must be at least 8 characters long";
        document.getElementById('loginPassword').innerHTML = '';
        return;
    }

    // Logging for debugging purposes ------------------------------------------------
    if (username || password) {
        console.log(`Username: ${username}, Password: ${password}`);//FIXME REMOVE THIS ONCE IT'S WORKING!!!!!!!!!!!!!!
    }
    if (!username || !password) {
        console.log('Please provide a username and password');
        return;
    } else {
        console.log(`Username: ${username}, Password: ${password}`);//FIXME REMOVE THIS ONCE IT'S WORKING!!!!!!!!!!!!!!
    }
    //--------------------------------------------------------------------------------

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            lastLogin: date
        })
    })

    if (response.status >= 400) {
        const data = await response.text();
        console.log(`Error during login: ${data}`);
        errorMessage.innerHTML = "Invalid username or password. Please try again.";
        document.getElementById('loginUsername').innerHTML = '';
        document.getElementById('loginPassword').innerHTML = '';
    } else {
        console.log(`User ${username} logged in successfully!`);
    }
    if (response.redirected) {
        window.location.href = response.url;
    }
});
