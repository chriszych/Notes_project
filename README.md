Markdown
# 📝 Notes App

A full-stack web application for managing personal notes with secure user authentication, built using **Node.js**, **Express.js**, **React**, **Vite**, and **PostgreSQL**.

---

## 🚀 Features

- 🔒 **Secure Authentication:** User registration and login powered by JSON Web Tokens (JWT) stored in secure cookies.
- 📌 **Full CRUD Operations:** Create, view, update, and delete notes in real time.
- 🛡️ **Protected Routes:** Restrict access to notes and user settings exclusively to authenticated users.
- 🎨 **Responsive UI:** Clean and intuitive user interface built with React and custom CSS.

---

## 🛠️ Tech Stack

### Frontend
- **React** (powered by **Vite**)
- **React Router DOM** (client-side routing)
- **Context API** (global user state management)
- **CSS3**

### Backend
- **Node.js** & **Express.js** (RESTful API)
- **PostgreSQL** (relational database)
- **JSON Web Token (JWT)** & **cookie-parser** (authentication middleware)
- **dotenv** (environment variable management)

---

## 📁 Project Structure

```text
notes-app/
├── client/                 # Frontend React application (Vite)
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components (Header, Footer, Note, CreateArea, etc.)
│       ├── context/        # React Context (UserContext)
│       ├── pages/          # Application views (Login, Register, Notes, Settings)
│       ├── App.jsx         # Main application component & routes
│       └── main.jsx        # React entry point
│
└── server/                 # Backend Node.js application (Express)
    ├── config/             # Database connection (PostgreSQL) and JWT configuration
    ├── controllers/        # Business logic handlers (noteApiController, userApiController)
    ├── middleware/         # Authentication and request middleware
    ├── routes/             # API route definitions (/api/notes, /api/users)
    └── index.js            # Express server entry point
⚙️ Prerequisites
Ensure you have the following installed on your machine before running the application:

- Node.js (v16 or higher)
- npm
-PostgreSQL

🚀 Getting Started
1. Clone the Repository
Bash
git clone [https://github.com/chriszych/Notes_project.git]
cd notes-app
2. Backend Setup (Server)
Navigate to the server directory:

Bash
cd server
Install dependencies:

Bash
npm install
Create a .env file in the server/ root directory with your database and JWT configurations:

Fragment kodu
PORT=5000
DATABASE_URL=postgres://postgres_user:postgres_password@localhost:5432/notesdb
JWT_SECRET=your_super_secret_jwt_key
Run the development server:

Bash
cd server
nodemon .\server.js

3. Frontend Setup (Client)
Open a new terminal window and navigate to the client directory:

Bash
cd client
npm install

Start the Vite development server:

npm run dev
Open your browser and navigate to: http://localhost:5173

🔌 API Endpoints
Authentication & Users (/api)

POST /api/register – Register a new user

POST /api/login – Authenticate user and issue JWT cookie

POST /api/logout – Log out user (clear JWT cookie)

GET /api/user - Get user data

PUT /api/user/password - update user's password

PUT /api/user/email - update user's email

DELETE /api/user - delete user's account


Notes (/api/notes)
GET /api/notes – Fetch all notes belonging to the authenticated user

POST /api/notes – Create a new note

PUT /api/notes/:id – Update an existing note

DELETE /api/notes/:id – Delete a note

🔒 Security Best Practices
Before deploying to production, make sure to:

Add .env and SSL keys (*.pem) to .gitignore to prevent committing sensitive secrets.

Hash user passwords securely in PostgreSQL using bcrypt.

Set JWT cookies with httpOnly: true, secure: true (for HTTPS), and appropriate sameSite attributes.

## 🗄️ Database Setup (PostgreSQL)

The application uses PostgreSQL as its primary relational database. The schema includes automatic timestamp tracking (`created_at`, `updated_at`) via triggers and foreign key cascading for data integrity.

### Database Schema Structure

- **`users`**: Stores user authentication credentials (`email`, hashed `password`).
- **`notes`**: Stores individual notes linked to a specific user (`id_user` -> `users.id` with `ON DELETE CASCADE`).


```mermaid
erDiagram
    USERS ||--o{ NOTES : "has"

    USERS {
        int id PK
        string email UK
        string password
        timestamp created_at
        timestamp updated_at
    }

    NOTES {
        int id PK
        int id_user FK
        string title
        text text
        timestamp created_at
        timestamp updated_at
    }
```

  if you are using a GUI database manager (such as pgAdmin, DBeaver, or TablePlus), open a new SQL query tab connected to your notes database, paste the contents of server/db/init.sql, and execute the query.