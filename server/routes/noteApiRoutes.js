import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";


import {
  listNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteApiController.js";

const router = express.Router();

router.use(methodOverride);

router.get("/", auth, listNotes);
router.post("/", auth, createNote);
router.get("/:id/edit", auth, getNoteById);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

export default router;