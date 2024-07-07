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

    // Event listener for resetSelectorButton
    resetSelectorButtonOne.addEventListener('click', () => {
        view = 'reset';
        console.log(`${view} selected`);
        changeView(view);
    });

    // Event listener for resetSelectorButtonTwo (if it exists)
    if (resetSelectorButtonTwo) {
        resetSelectorButtonTwo.addEventListener('click', () => {
            view = 'reset';
            console.log(`${view} selected`);
            changeView(view);
        });
    }
});