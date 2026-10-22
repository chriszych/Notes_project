import React, { useState, useEffect } from "react";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const notesRes = await fetch("/api/notes", {
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        const notesData = await notesRes.json();

        if (notesData.success && Array.isArray(notesData.data)) {
          setNotes(notesData.data);
        }
      } catch (err) {
        console.error("Fetching data error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addNote(newNote) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newNote),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Error during adding new note");
    }

    const savedNote = result.data || newNote;
    setNotes((prevNotes) => [savedNote, ...prevNotes]);
  }

  async function deleteNote(noteId) {
    if (!window.confirm("Are you sure to delete the note ?")) return;

    const res = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Error during deleting note from server");
    }

    //setNotes((prevNotes) => prevNotes.filter((_, index) => index !== id));
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  }

  async function saveNote(noteId, updatedNote) {
    let data = null;

    const res = await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedNote),
    });
    data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Error during modyfing note on server");
    }

    setNotes((prev) => [
      data.data,
      ...prev.filter((note) => note.id !== noteId),
    ]);
  }

  if (loading) {
    return <div className="text-center mt-5">Loading notes...</div>;
  }

  return (
    <div>
      <CreateArea onAdd={addNote} />

      <div className="notes-container">
        {notes.length === 0 ? (
          <p className="empty-info">You don't have your notes yet.</p>
        ) : (
          notes.map((noteItem, index) => (
            <Note
              key={noteItem.id || index}
              //id={index}
              //dbId={noteItem.id}
              title={noteItem.title}
              content={noteItem.content || noteItem.text}
              createdAt={new Date(noteItem.createdAt).toLocaleString("pl-PL")}
              updatedAt={new Date(noteItem.updatedAt).toLocaleString("pl-PL")}
              onDelete={() => deleteNote(noteItem.id)}
              onSave={(updatedNote) => saveNote(noteItem.id, updatedNote)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
