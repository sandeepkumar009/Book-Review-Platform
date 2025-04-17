# Book Review Platform

This is a full-stack book review platform built as part of the Full Stack Developer Assignment. Users can browse books, read reviews, write their own reviews, and rate books. The application features a React frontend and a Node.js/Express backend with MongoDB.

## Features

* **Frontend (React)**:
    * Responsive UI.
    * Home page displaying featured books.
    * Book listing page with search and filtering capabilities.
    * Detailed view for individual books, including reviews.
    * User profile page.
    * Review submission form.
    * State management using React Context (`frontend/src/contexts/AuthContext.jsx`).
    * Routing handled by React Router (`frontend/src/App.jsx`).
    * Integration with the backend API (`frontend/src/services/api.js`).
    * Error handling and loading indicators (`frontend/src/components/ErrorMessage.jsx`, `frontend/src/components/LoadingSpinner.jsx`).
* **Backend (Node.js, Express, MongoDB)**:
    * RESTful API endpoints for books, reviews, and users (`backend/routes/`).
    * Data validation and error handling middleware (`backend/middleware/`).
    * MongoDB for data persistence (`backend/config/db.js`, `backend/models/`).
    * Authentication using JWT (`backend/middleware/authMiddleware.js`).
    * Seeding script for initial book data (`backend/seed.js`).

## Project Structure
```
Book-Review-Platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env          # Environment variables (needs to be created)
│   ├── package.json
│   ├── server.js     # Backend entry point
│   └── seed.js       # Database seeding script
└── frontend/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx    # Frontend entry point
├── .env          # Environment variables (needs to be created)
├── index.html
├── package.json
└── vite.config.js
```
## Setup Instructions

### Prerequisites

* Node.js (version specified in `backend/package.json` and `frontend/package.json` or latest LTS recommended)
* npm (Node Package Manager)
* MongoDB instance (local or cloud like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd Book-Review-Platform/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```env
    NODE_ENV=development
    PORT=5001 # Or any port you prefer
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    FRONTEND_URL=http://localhost:5173 # Or your frontend's development URL
    ```
    *Replace placeholders with your actual MongoDB connection string and a strong secret for JWT.*
4.  **Start the backend server:**
    * For development (with nodemon):
        ```bash
        npm run dev
        ```
    * For production:
        ```bash
        npm start
        ```
    *The backend should now be running (typically on http://localhost:5001).*

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd Book-Review-Platform/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `frontend` directory (if you need to override the backend URL):
    ```env
    VITE_API_BASE_URL=http://localhost:5001/api # Or your backend API URL
    ```
    *This step might be optional if the default in `frontend/src/services/api.js` points to your running backend.*
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    *The frontend development server (using Vite) will typically start on http://localhost:5173.*

### Database Seeding (`backend/seed.js`)

The `seed.js` script located in the `backend` directory is used to populate the MongoDB database with initial sample book data. This is useful for development and testing purposes.

* **Purpose**: To insert a predefined list of books into the `books` collection. It first clears any existing books in the collection before inserting the new ones.
* **Prerequisites**: Ensure your MongoDB server is running and the `MONGO_URI` in the `backend/.env` file is correctly configured before running the script.
* **How to run**:
    * Navigate to the `backend` directory in your terminal.
    * To **import** the seed data:
        ```bash
        node seed.js
        ```
    * To **destroy** (delete) all data in the `books` collection:
        ```bash
        node seed.js -d
        ```
* **Data Source**: The script uses a hardcoded array of book objects, including details like title, author, description, genre, publication date, and cover image URLs from Project Gutenberg (`backend/seed.js`).

## API Endpoints

* `GET /api/books`: Retrieve books (supports pagination, search, genre filter).
* `GET /api/books/genres`: Retrieve distinct genres.
* `GET /api/books/:id`: Retrieve a specific book by its ID.
* `POST /api/books`: Add a new book (Admin only, requires authentication).
* `GET /api/reviews?bookId=<bookId>`: Retrieve reviews for a specific book.
* `POST /api/reviews`: Submit a new review (Requires authentication).
* `GET /api/users`: Retrieve all users (Admin only, requires authentication).
* `POST /api/users/register`: Register a new user.
* `POST /api/users/login`: Log in a user and receive a JWT.
* `GET /api/users/:id`: Retrieve a specific user's profile.
* `PUT /api/users/:id`: Update a user's profile (Requires authentication, user can only update their own profile).
* `DELETE /api/users/:id`: Delete a user (Admin only, requires authentication).
* `GET /api/users/:userId/reviews`: Retrieve all reviews written by a specific user.

## Additional Notes

* The application uses JWT for authentication. Tokens are stored in localStorage on the frontend.
* Admin functionalities (like adding/deleting books/users) require a user with the 'admin' role.
* Average book ratings are calculated automatically when reviews are added or removed (`backend/models/Review.js`).
