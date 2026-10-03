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
      auth: "/api/users",
      notes: "/api/notes"
    }
  });
});

export default app;
