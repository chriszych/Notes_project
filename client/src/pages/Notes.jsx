import React, { useState, useEffect } from "react";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("/api/user", { credentials: "include" });
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.data);
        }

        const notesRes = await fetch("/api/notes", {
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        const notesData = await notesRes.json();

        if (notesData.success && Array.isArray(notesData.data)) {
          setNotes(notesData.data);
        }
      } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addNote(newNote) {
    try {
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

      if (res.ok && result.success) {
        const savedNote = result.data || newNote;

        setNotes((prevNotes) => [savedNote, ...prevNotes]);
      } else {
        alert(result.message || "Błąd podczas dodawania notatki");
      }
    } catch (err) {
      console.error("Błąd sieci podczas dodawania notatki:", err);
    }
  }

  async function deleteNote(id, noteId) {
    if (!window.confirm("Czy na pewno chcesz usunąć tę notatkę?")) return;

    try {
      if (noteId) {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "DELETE",
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data.message || "Nie udało się usunąć notatki z serwera");
          return;
        }
      }

      setNotes((prevNotes) => prevNotes.filter((_, index) => index !== id));
    } catch (err) {
      console.error("Błąd podczas usuwania:", err);
    }
  }

  async function saveNote(noteId, updatedNote) {
    let data = null;

    try {
      if (noteId) {
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
          alert(data.message || "Nie udało się zmienić notatki na serwerze");
          return;
        }
      }

      const returnedNote = data.data;

      setNotes((prevNotes) => {
        const restNotes = prevNotes.filter((note) => note.id !== noteId);
        return [returnedNote, ...restNotes];
      });
    } catch (err) {
      console.error("Błąd podczas aktualizacji notatki:", err);
    }
  }

  if (loading) {
    return <div className="text-center mt-5">Ładowanie notatek...</div>;
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
              id={index}
              dbId={noteItem.id}
              title={noteItem.title}
              content={noteItem.content || noteItem.text}
              createdAt={new Date(noteItem.createdAt).toLocaleString("pl-PL")}
              updatedAt={new Date(noteItem.updatedAt).toLocaleString("pl-PL")}
              onDelete={() => deleteNote(index, noteItem.id)}
              onSave={(updatedNote) => saveNote(noteItem.id, updatedNote)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
