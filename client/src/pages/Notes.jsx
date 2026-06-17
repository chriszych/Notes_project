import React, { useState } from "react";
//import Header from "./Header";
//import Footer from "./Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

function Notes() {

const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <CreateArea onAdd={addNote} />
      <div className="notes-container">
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      </div>
      </div>
  );
}

export default Notes;