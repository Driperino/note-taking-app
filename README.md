Note-Taking App

# Overview

This is a note-taking application built using Node.js, Express, and MongoDB. It features user authentication, CRUD operations for notes, and a UI styled with Tailwind CSS.

## Features

- User Authentication: Secure login and registration with session management.
- CRUD Operations: Create, read, update, and delete notes.
- User-friendly interface with Tailwind CSS.
- Settings Panel: Update user details, change password, and theme toggle.
- Confirmation Modals: Custom modals for user actions.

## Getting Started

Follow these steps to set up and run the application:

1. Clone the repository:

```
git clone https://github.com/driperino/note-taking-app.git
```

2. Navigate to the project directory:

```
cd note-taking-app
```

3. Install dependencies:

```
npm install
```

4. Create a .env file in the root directory and add your MongoDB URI:

```
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret
```

5. Start the application:

```
npm start
```

6. Open your browser and navigate to http://localhost:3000 to use the app.

## Running the Application

To run the application in development mode with automatic reloading:

```
npm run dev
```

To build and start the production version:

```
npm run build
npm start
```

## Usage

- Login/Registration: Access the login and registration forms from the menu.
- Notes Management: Use the 'New', 'Save', and 'Delete' buttons to manage your notes.
- Access stored notes in the drop down menu.
- Settings: Update user information, change password, and toggle themes from the settings panel.

## Project Structure

```
note-taking-app
├── src
│   ├── models
│   │   └── models.js
│   ├── routers
│   │   ├── authRouter.js
│   │   └── noteRouter.js
│   ├── app.js
│   ├── input.css
│   └── package.json
├── public
│   ├── css
│   │   ├── output.css
│   │   └── styles.css
│   ├── index.html
│   ├── login.html
│   ├── script.js
│   └── login.js
├── README.md
└── tailwind.config.js
```

## API Endpoints

### Notes

**Get All Notes**

- URL: /notes
- Method: GET
- Authentication: Required
- Description: Retrieve all notes for the authenticated user.
- Success Response: 200 OK
- Error Response: 500 Internal Server Error

**Get Single Note**

- URL: /notes/:id
- Method: GET
- Authentication: Required
- Description: Retrieve a single note by its ID.
- Success Response: 200 OK
- Error Response: 404 Not Found, 500 Internal Server Error

**Create Note**

- URL: /notes
- Method: POST
- Authentication: Required
- Description: Create a new note.
- Request Body: title, content
- Success Response: 201 Created
- Error Response: 400 Bad Request, 500 Internal Server Error

**Update Note**

- URL: /notes/:id
- Method: PATCH
- Authentication: Required
- Description: Update an existing note.
- Request Body: title, content
- Success Response: 200 OK
- Error Response: 400 Bad Request, 404 Not Found, 500 Internal Server Error

**Delete Note**

- URL: /notes/:id
- Method: DELETE
- Authentication: Required
- Description: Delete a note.
- Success Response: 200 OK
- Error Response: 404 Not Found, 500 Internal Server Error

### User Authentication

**Login**

- URL: /login
- Method: POST
- Description: Authenticate a user and start a session.
- Request Body: username, password
- Success Response: Redirect to /app
- Error Response: 401 Unauthorized

**Register**

- URL: /register
- Method: POST
- Description: Register a new user.
- Request Body: username, password
- Success Response: Redirect to /app
- Error Response: 400 Bad Request, 500 Internal Server Error

**Get User Info**

- URL: /user
- Method: GET
- Authentication: Required
- Description: Retrieve information about the authenticated user.
- Success Response: 200 OK
- Error Response: 401 Unauthorized

**Update Username**

- URL: /username
- Method: PATCH
- Authentication: Required
- Description: Update the username for the authenticated user.
- Request Body: username
- Success Response: 200 OK
- Error Response: 400 Bad Request, 500 Internal Server Error

**Update Password**

- URL: /password
- Method: PATCH
- Authentication: Required
- Description: Update the password for the authenticated user.
- Request Body: password
- Success Response: 200 OK
- Error Response: 400 Bad Request, 500 Internal Server Error

**Update Email**

- URL: /email
- Method: PUT or PATCH
- Authentication: Required
- Description: Update the email for the authenticated user.
- Request Body: email
- Success Response: 200 OK
- Error Response: 400 Bad Request, 500 Internal Server Error

**Update Theme**

- URL: /theme
- Method: PATCH
- Authentication: Required
- Description: Update the theme for the authenticated user.
- Request Body: theme
- Success Response: 200 OK
- Error Response: 400 Bad Request, 500 Internal Server Error

**Logout**

- URL: /logout
- Method: POST
- Description: Log out the current user.
- Success Response: Redirect to /app/login.html
- Error Response: 500 Internal Server Error

**Delete User**

- URL: /user
- Method: DELETE
- Authentication: Required
- Description: Delete the authenticated user's account and associated notes.
- Success Response: 200 OK
- Error Response: 500 Internal Server Error, 401 Unauthorized

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## Dependencies

### Core Dependencies

- express: Web framework for building the server and handling HTTP requests and responses.ond to requests from different origins.
- mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js, used for managing data in MongoDB.ication.
- cors: Middleware for enabling Cross-Origin Resource Sharing, allowing the server to respond to requests from different origins.-session: Middleware for managing session data in Express applications.
- passport: Authentication middleware for Node.js, used for managing user authentication.
- express-session: Middleware for managing session data in Express applications.
  ngoose model representing the structure of a user in the database.

### Models

on, and user management.

- Note: Mongoose model representing the structure of a note in the database.ndling routes for note management, including CRUD operations.
- User: Mongoose model representing the structure of a user in the database.

### Routers

- authRouter: Router handling authentication-related routes such as login, registration, and user management.
- noteRouter: Router handling routes for note management, including CRUD operations.

### Server Configuration

- app: Instance of the Express application.
- port: Port on which the server will listen for incoming requests. Defaults to 3000 if not set by the environment.

port: Port on which the server will listen for incoming requests. Defaults to 3000 if not set by the environment.
