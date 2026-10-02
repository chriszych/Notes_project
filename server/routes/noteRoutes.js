import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";

import {

  newNoteForm,
  listNotes,
  editNoteForm,

} from "../controllers/noteViewController.js";

const router = express.Router();

router.use(methodOverride);

router.get("/home", auth, listNotes);
router.get("/new", auth, newNoteForm);
router.get("/:id/edit", auth, editNoteForm);


export default router;