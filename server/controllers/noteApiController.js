import db from "../config/db.js";

export async function listNotes(req, res) {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM notes WHERE id_user = $1 ORDER BY updated_at DESC, created_at DESC",
      [userId]
    );

    const formattedNotes = result.rows.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.text,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    }));

    return res.status(200).json({
      success: true,
      data: formattedNotes,
    });

    // res.render("notes.ejs", {
    //   notes: notes.rows,
    //   userId,
    //   email: req.user.email,
    // });
  } catch (err) {
    console.error("Database error during fetching notes:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the notes",
    });
  }
}

export async function createNote(req, res) {
  const userId = req.user.id;
  const { title, content } = req.body;

  if (title === undefined || content === undefined) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required!",
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO notes (id_user, title, text) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content]
    );

    if (!result.rowCount) {
      return res.status(400).json({
        success: false,
        message: "Error adding the note!",
      });
    }

    const note = result.rows[0];

    const formattedNote = {
      id: note.id,
      title: note.title,
      content: note.text,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    };

    return res.status(201).json({
      success: true,
      message: "Note added",
      data: formattedNote,
    });
  } catch (err) {
    console.error("Database error during adding new note:", err);

    return res.status(500).json({
      success: false,
      message: "Problem with adding note!",
    });
  }
}

export async function updateNote(req, res) {
  const userId = req.user.id;
  const noteId = Number(req.params.id);
  const { title, content } = req.body;

  if (isNaN(noteId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
    });
  }

  if (title === undefined || content === undefined) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required!",
    });
  }

  try {
    const result = await db.query(
      "UPDATE notes SET title = $1, text = $2 WHERE id = $3 AND id_user = $4 RETURNING *",
      [title, content, noteId, userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Note not found!",
      });
    }

    const note = result.rows[0];

    const formattedNote = {
      id: note.id,
      title: note.title,
      content: note.text,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    };

    return res.status(200).json({
      success: true,
      message: "Note updated",
      data: formattedNote,
    });
  } catch (err) {
    console.error("Database error during note update:", err);

    return res.status(500).json({
      success: false,
      message: "Problem with updating note!",
    });
  }
}

export async function deleteNote(req, res) {
  const userId = req.user.id;
  const noteId = Number(req.params.id);

  if (isNaN(noteId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
    });
  }

  try {
    const result = await db.query(
      "DELETE FROM notes WHERE id = $1 AND id_user = $2",
      [noteId, userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Note not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted",
    });
  } catch (err) {
    console.error("Database error during note deletion:", err);
    return res.status(500).json({
      success: false,
      message: "Problem with deleting note!",
    });
  }
}
