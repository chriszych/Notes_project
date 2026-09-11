import express from "express";
import cookieParser from "cookie-parser";
import notesApiRoutes from "./routes/noteApiRoutes.js";
import notesRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userApiRoutes from "./routes/userApiRoutes.js";

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/notes", notesApiRoutes);
app.use("/", notesRoutes);
//app.use("/api/user", userRoutes);
app.use("/", userRoutes);
app.use("/api", userApiRoutes);

export default app;
