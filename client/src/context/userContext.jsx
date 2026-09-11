import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  // Funkcja dostępna teraz globalnie
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          return;
        }
      }
      setUser(null);
    } catch (err) {
      console.error("Błąd autoryzacji:", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Błąd wylogowania na serwerze:", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}