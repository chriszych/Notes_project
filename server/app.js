import express from "express";
import cookieParser from "cookie-parser";
import notesApiRoutes from "./routes/noteApiRoutes.js";
import userApiRoutes from "./routes/userApiRoutes.js";

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/notes", notesApiRoutes);
app.use("/api", userApiRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Notes App REST API is running",
    version: "1.0.0",
    endpoints: {
      auth: {
        login: "POST /api/login",
        register: "POST /api/register",
        logout: "POST /api/logout",
      },
      user: {
        profile: "GET /api/user",
        updateEmail: "PUT /api/user/email",
        updatePassword: "PUT /api/user/password",
        deleteAccount: "DELETE /api/user",
      },
      notes: {
        listNotes: "GET /api/notes",
        createNote: "POST /api/notes",
        updateNote: "PUT /api/notes/id",
        deleteNote: "DELETE /api/notes/id",
      },
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
