# Note Taking App

A simple note-taking application built with Node.js, Express, MongoDB, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
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

## Demo

![Demo](demo.gif)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version >= 14.17.0)
- MongoDB (Make sure MongoDB server is running)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your/repository.git
   cd repository-name
   ```

   Install dependencies:

2. Install:

   ```
   npm install
   ```

3. Configuration:

   Create a .env file in the root directory based on .env.example.
   Update .env file with your MongoDB connection URI and a session secret.

4. Start the server:

   ```
   npm start
   ```

   Open your web browser and navigate to http://localhost:3000.

### Usage

Register a new account or use the provided test account.

Start taking notes!

API Endpoints
Authentication
POST /auth/register: Register a new user.
POST /auth/login: Log in an existing user.
GET /auth/logout: Log out the current user.
Notes
GET /notes: Fetch all notes for the current user.
GET /notes/:id: Fetch a specific note by ID.
PUT /notes: Create a new note.
PATCH /notes/:id: Update an existing note by ID.
DELETE /notes/:id: Delete a note by ID.
Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for bugs, feature requests, or suggestions.
