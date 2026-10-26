import React, { useState, useEffect } from "react";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/notes", {
          withCredentials: true,
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          setNotes(response.data.data);
        } else {
          console.error("Invalid response data:", response.data);
        }
      } catch (err) {
        if (err.response) {
          console.error("Server error while fetching notes:", err.response);
        } else {
          console.error("Fetching data error:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addNote(newNote) {
    try {
      const response = await axios.post("/api/notes", newNote, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during adding new note"
        );
      }

      const savedNote = response.data.data || newNote;
      setNotes((prevNotes) => [savedNote, ...prevNotes]);
    } catch (err) {
      if (err.response) {
        console.error("Server error during adding new note:", err.response);
        alert(
          err.response.data?.message || "Server error during adding new note"
        );
      } else {
        console.error("Adding note error:", err);
        alert(err.message || "Problem with connection or adding note.");
      }
    }
  }

  async function deleteNote(noteId) {
    if (!window.confirm("Are you sure to delete this note ?")) return;

    try {
      const response = await axios.delete(`/api/notes/${noteId}`, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during deleting note from server"
        );
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      if (err.response) {
        console.error("Server error during deleting note:", err.response);
        alert(
          err.response.data?.message || "Server error during deleting note"
        );
      } else {
        console.error("Deleting note error:", err);
        alert(err.message || "Problem with connection or deleting note.");
      }
    }
  }

  async function saveNote(noteId, updatedNote) {
    try {
      const response = await axios.put(`/api/notes/${noteId}`, updatedNote, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during modyfing note on server"
        );
      }

      setNotes((prev) => [
        response.data.data,
        ...prev.filter((note) => note.id !== noteId),
      ]);
    } catch (err) {
      if (err.response) {
        console.error("Server error during saving note:", err.response);
        alert(err.response.data?.message || "Server error during saving note");
      } else {
        console.error("Saving note error:", err);
        alert(err.message || "Problem with connection or saving note.");
      }
    }
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
