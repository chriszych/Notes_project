import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Notes from "./pages/Notes";
import { UserProvider } from "./context/userContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route element={<GuestRoute />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              </Route>

              <Route element={<ProtectedRoute />}>
              <Route
                path="/settings"
                element={<Settings />}
              />
              <Route
                path="/notes"
                element={
                    <Notes />
                }
              />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
