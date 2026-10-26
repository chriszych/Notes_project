import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user", { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setUser(null);
      } else {
        console.error("Server connection error during authorisation:", err);
        alert(
          "Server connection error during authorisation. Please try again later."
        );
        setUser(null);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("User logout on server error:", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loadingUser, logout, fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
