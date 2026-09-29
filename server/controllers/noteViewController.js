export async function newNoteForm(req, res) {
  res.render("noteForm", { mode: "create", note: null });
}

export async function editNoteForm(req, res) {
  res.render("noteForm", {
    mode: "edit",
    note: null,
  });
}

export async function listNotes(req, res) {
  res.render("notes", {
    user: req.user,
  });
}
