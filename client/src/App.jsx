import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Notes from "./pages/Notes";
import { UserContext, UserProvider } from "./context/userContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  // const [notes, setNotes] = useState([]);

  // function addNote(newNote) {
  //   setNotes(prevNotes => {
  //     return [...prevNotes, newNote];
  //   });
  // }

  // function deleteNote(id) {
  //   setNotes(prevNotes => {
  //     return prevNotes.filter((noteItem, index) => {
  //       return index !== id;
  //     });
  //   });
  // }

  return (
    <BrowserRouter>
    <UserProvider>
    <div id="root">
      <Header />
      {/* <Notes/> */}
      <main>

      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={
        <ProtectedRoute>
        <Settings />
        </ProtectedRoute>
        } />
      <Route path="/notes" element={
        <ProtectedRoute>
        <Notes />
        </ProtectedRoute>
      } />
      


  {/* catch-all */}
  <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* <div className="login-wrapper">
      <Login />
      <CreateArea onAdd={addNote} />
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
      </div> */}
      </main>
      <Footer />
    </div>
    </UserProvider>
    </BrowserRouter>
  );
}

export default App;
