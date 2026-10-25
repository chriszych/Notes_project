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
        // const notesRes = await fetch("/api/notes", {
        //   headers: { Accept: "application/json" },
        //   credentials: "include",
        // });
        // const notesData = await notesRes.json();

        const response  = await axios.get("/api/notes", { withCredentials: true });

        // if (notesData.success && Array.isArray(notesData.data)) {
        //   setNotes(notesData.data);
        // }
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

    // const res = await fetch("/api/notes", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    //   credentials: "include",
    //   body: JSON.stringify(newNote),
    // });

    // const result = await res.json();
    try{

    const response = await axios.post("/api/notes", newNote, { withCredentials: true });

    // if (!res.ok || !result.success) {
    //   throw new Error(result.message || "Error during adding new note");
    // }
    if (!response.data.success) {
      throw new Error(response.data.message || "Error during adding new note");
    } 

    //const savedNote = result.data || newNote;
    const savedNote = response.data.data || newNote;
    setNotes((prevNotes) => [savedNote, ...prevNotes]);

    } catch (err) {
      if (err.response) {
        console.error("Server error during adding new note:", err.response);
        alert(err.response.data?.message || "Server error during adding new note");
      } else {
        console.error("Adding note error:", err);
        alert(err.message || "Problem with connection or adding note.");
    }
    }
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
