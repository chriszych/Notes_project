import React, { useState, useEffect } from "react";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

function Notes() {
  // Stan na listę notatek (początkowo pusta tablica)
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pobieranie danych z backendu przy pierwszym wyrenderowaniu komponentu
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Pobieranie danych użytkownika
        const userRes = await fetch("/api/user", { credentials: "include" });
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.data);
        }

        // 2. Pobieranie notatek
        const notesRes = await fetch("/api/notes", {
          headers: { Accept: "application/json" },
          credentials: "include"
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

  // Dodawanie nowej notatki (lokalnie + wysyłka na backend)
  async function addNote(newNote) {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        credentials: "include",
        body: JSON.stringify(newNote)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Jeśli backend zwraca utworzony obiekt notatki, dodajemy go do stanu
        const savedNote = result.data || newNote;
        //test odpowiedzi api
        //console.log(result.data, result.success, result)
        //koniec testu odpowiedzi api
        setNotes((prevNotes) => [savedNote, ...prevNotes]);
      } else {
        alert(result.message || "Błąd podczas dodawania notatki");
      }
    } catch (err) {
      console.error("Błąd sieci podczas dodawania notatki:", err);
    }
  }

  // Usuwanie notatki (lokalnie + z serwera)
  async function deleteNote(id, noteId) {
    if (!window.confirm("Czy na pewno chcesz usunąć tę notatkę?")) return;

    try {
      // Jeśli notatka posiada ID z bazy danych, usuwamy ją na serwerze
      if (noteId) {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "DELETE",
          headers: { Accept: "application/json" },
          credentials: "include"
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data.message || "Nie udało się usunąć notatki z serwera");
          return;
        }
      }

      // Aktualizujemy stan Reacta, usuwając notatkę z listy
      setNotes((prevNotes) => prevNotes.filter((_, index) => index !== id));
    } catch (err) {
      console.error("Błąd podczas usuwania:", err);
    }
  }

  function editNote(id) {
    // Miejsce na obsługę edycji
    console.log("Edycja notatki o indeksie:", id);
  }

   function saveNote(id) {
    // Miejsce na obsługę edycji
    console.log("Zapis notatki o indeksie:", id);
  }

  if (loading) {
    return <div className="text-center mt-5">Ładowanie notatek...</div>;
  }

  return (
    <div>
      {/* {user && <div className="user-info">Witaj: {user.email} !</div>} */}
      
      <CreateArea onAdd={addNote} />

      <div className="notes-container">
        {notes.length === 0 ? (
          <p className="empty-info">You don't have your notes yet.</p>
        ) : (
          notes.map((noteItem, index) => (
            <Note
              key={noteItem.id || index}
              id={index}
              dbId={noteItem.id} // przekazujemy ID z bazy danych do usuwania/edycji
              title={noteItem.title}
              content={noteItem.content || noteItem.text}
              createdAt={new Date(noteItem.createdAt).toLocaleString('pl-PL')}
              updatedAt={new Date(noteItem.updatedAt).toLocaleString('pl-PL')}
              onEdit={editNote}
              onDelete={() => deleteNote(index, noteItem.id)}
              onSave={saveNote}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;