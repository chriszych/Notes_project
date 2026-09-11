import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";

import {

  newNoteForm,
  listNotes,
  //createNote,
  editNoteForm,

} from "../controllers/noteViewController.js";

const router = express.Router();

router.use(methodOverride);

router.get("/home", auth, listNotes);
router.get("/new", auth, newNoteForm);
//router.post("/", auth, createNote);
//router.get("/:id/edit", auth, getNoteById);
router.get("/:id/edit", auth, editNoteForm);
//router.put("/:id", auth, updateNote);
//router.delete("/:id", auth, deleteNote);

export default router;