# Book Review Platform

## Objective

A full-stack web application developed as part of a developer assignment. This platform allows users to browse books, read and write reviews, and rate books[cite: 2]. It features a React frontend and a Node.js (Express) backend connected to a MongoDB database[cite: 2].

## Features

**Frontend (React):** [cite: 4]

* Responsive user interface built with React and Tailwind CSS.
* **Home Page:** Displays featured books.
* **Book Listing Page:** Shows all books with search (by title/author) and genre filtering capabilities, including pagination.
* **Book Detail Page:** Presents detailed information about a single book and its associated user reviews.
* **User Profile Page:** Displays user information (viewable by anyone) and allows users to edit their own profile (name, email, bio).
* **Review Submission:** Logged-in users can submit ratings and comments for books via a form on the Book Detail Page.
* **Login/Register Pages:** Allows users to register for an account and log in.
* **State Management:** Uses React Context API for managing authentication state.
* **Routing:** Uses React Router for navigation between pages.
* **User Experience:** Includes loading indicators and error messages.

**Backend (Node.js / Express):** [cite: 3]

* RESTful API built with Node.js and Express.
* **Database:** Uses MongoDB with Mongoose for data persistence and modeling (Users, Books, Reviews).
* **Authentication:** Implemented using JSON Web Tokens (JWT) for protected routes.
* **Authorization:** Role-based access control (user vs. admin). The endpoint for adding new books (`POST /api/books`) is restricted to admin users.
* **API Endpoints:** Provides endpoints for managing books, reviews, and users (details below).
* **Data Validation:** Uses `express-validator` to validate incoming request data.
* **Error Handling:** Includes centralized error handling middleware.
* **Average Rating Calculation:** Automatically calculates and updates the average rating for a book when reviews are added or removed.

## Technologies Used

* **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios (or Fetch API)
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Authentication:** JWT (jsonwebtoken), bcryptjs
* **Validation:** express-validator
* **Development:** nodemon

## Directory Structure
```
Book-Review-Platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env            # (Needs to be created)
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env            # (Optional: For VITE_API_URL etc.)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js # Usually present for customization
│   └── vite.config.js
└── README.md           # This file
```

## Prerequisites

* Node.js (v16 or later recommended)
* npm (usually comes with Node.js) or yarn
* MongoDB (running locally or using a cloud service like MongoDB Atlas)

## Setup and Installation [cite: 1]

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd Book-Review-Platform
    ```

2.  **Backend Setup:**
    * Navigate to the backend directory:
        ```bash
        cd backend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * Create a `.env` file in the `backend` directory and add the following environment variables, replacing placeholder values:
        ```env
        NODE_ENV=development
        PORT=5001 # Port for the backend server
        MONGO_URI=<your_mongodb_connection_string> # e.g., mongodb://localhost:27017/bookReviewDB or Atlas URI
        JWT_SECRET=<your_strong_jwt_secret_key> # A strong, random secret string
        JWT_EXPIRES_IN=30d # Optional: Token expiration (e.g., 30d, 1h)
        ```
    * **Seed the Database (Optional but Recommended):** Populate the database with initial book data. Make sure your database is running and the `MONGO_URI` in `.env` is correct.
        ```bash
        node seed.js
        ```
    * **Create an Admin User (Required for adding books):**
        * Register a new user through the frontend application.
        * Manually update that user's document in the MongoDB `users` collection. Set the `role` field from `"user"` to `"admin"`. You can use MongoDB Compass or the `mongo` shell for this.
    * **Run the Backend Server:**
        * For development (with auto-restart):
            ```bash
            npm run dev
            ```
        * For production:
            ```bash
            npm start
            ```
        The backend server should now be running (typically on `http://localhost:5001`).

3.  **Frontend Setup:**
    * Navigate to the frontend directory from the root project folder:
        ```bash
        cd ../frontend
        # Or from backend: cd ../frontend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * **API URL Configuration (Important):** The frontend needs to know where the backend API is running. The `services/api.js` file currently uses `http://localhost:5001/api`. If your backend runs on a different URL or port, update the `BASE_URL` constant in `frontend/src/services/api.js`. Alternatively, you can use frontend environment variables (e.g., a `.env` file in the `frontend` directory with `VITE_API_BASE_URL=http://localhost:5001/api` and update `api.js` to use `import.meta.env.VITE_API_BASE_URL`).
    * **Run the Frontend Development Server:**
        ```bash
        npm run dev
        ```
        The frontend development server should now be running (typically on `http://localhost:5173` or another port shown in the terminal). Open this URL in your browser.

## API Endpoints [cite: 3]

The following RESTful API endpoints are available on the backend:

**Books**

* `GET /api/books`: Get all books (supports `page`, `limit`, `search`, `genre` query params).
* `GET /api/books/genres`: Get a list of distinct genres available.
* `GET /api/books/:id`: Get details for a single book.
* `POST /api/books`: Add a new book (Admin only, requires JWT token).

**Reviews**

* `GET /api/reviews?bookId=<bookId>`: Get all reviews for a specific book.
* `POST /api/reviews`: Submit a new review for a book (Requires JWT token).

**Users / Auth**

* `POST /api/users/register`: Register a new user.
* `POST /api/users/login`: Log in a user, returns JWT token and user info.
* `GET /api/users/:id`: Get public profile information for a user.
* `PUT /api/users/:id`: Update the profile for the logged-in user (Requires JWT token, user can only update their own profile).

**(Admin Only User Routes)**

* `GET /api/users`: Get a list of all users (Admin only, requires JWT token).
* `DELETE /api/users/:id`: Delete a user (Admin only, requires JWT token).

## Additional Notes [cite: 1]

* Ensure MongoDB is running before starting the backend server.
* The `seed.js` script will delete existing books before importing sample data. Use with caution.
* The admin role must be assigned manually in the database for testing admin-only features.
* (Optional) Add deployment instructions or a link to a live demo if available.

