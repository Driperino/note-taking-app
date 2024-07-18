# Note-Taking App

A simple note-taking application built with Node.js, Express, MongoDB, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a web-based note-taking application that allows users to create, save, update, and delete notes. It uses Node.js and Express for the backend server, MongoDB for data storage, and Tailwind CSS for styling.

## Features

- User authentication (register, login, logout)
- CRUD operations on notes (create, read, update, delete)
- Responsive and user-friendly UI with Tailwind CSS
- Secure password hashing with bcrypt
- Session management with Express Session and Passport

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version >= 14.17.0)
- MongoDB (Make sure MongoDB server is running)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Driperino/note-taking-app.git
   cd note-taking-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following:

   ```
   PORT=3000
   ```

4. Start the MongoDB server:

   Make sure your MongoDB server is running. You can start it using the following command if you installed MongoDB as a service:

   ```bash
   mongod
   ```

## Running the Application

1. Start the application:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000/app/login.html` to access the login page.

## Usage

- Register a new account or use the provided test account.
- Start taking notes!

## Project Structure

- `src/`
  - `models/`: Contains Mongoose models for `User` and `Note`.
  - `routers/`: Contains the `authRouter` and `noteRouter` for handling authentication and note-related routes.
  - `public/`: Contains static files such as HTML, CSS, and JavaScript.
  - `app.js`: Main application file to start the server.

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in an existing user.
- **GET /auth/logout**: Log out the current user.

### Notes

- **GET /notes**: Fetch all notes for the current user.
- **GET /notes/:id**: Fetch a specific note by ID.
- **PUT /notes**: Create a new note.
- **PATCH /notes/:id**: Update an existing note by ID.
- **DELETE /notes/:id**: Delete a note by ID.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for bugs, feature requests, or suggestions.

## Dependencies

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport](http://www.passportjs.org/)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
