import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import HighlightIcon from "@mui/icons-material/Highlight";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditNoteIcon from '@mui/icons-material/EditNote';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, loadingUser, logout } = useContext(UserContext);
  const [isSettings, setSettings] = useState(true);
  const navigate = useNavigate();

  function settings() {
    navigate("/settings");
    setSettings(false);
  }

    function goNotes() {
    navigate("/notes");
    setSettings(true);
  }

  if (loadingUser) return null; // Lub prosty loader

  return (
    <header className="header-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
      
      <div className="header-user-nav" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {user ? (
          <>
          <PersonIcon />
            <span><strong>{user.email}</strong></span>
            
            <button>
            {isSettings == true ? (
            <SettingsIcon onClick={settings}/>
            ) : (
            <NoteAltIcon onClick={goNotes}/>
            )}

            </button>
            
            
            
            {/* <Link to="/settings">Ustawienia konta</Link> */}
            <button onClick={logout} className="logout-btn">
            <LogoutIcon />
            </button>
            {/* <button onClick={logout} className="logout-btn">Wyloguj</button> */}
          </>
        ) : (
           <Link to="/register"></Link>
        )}
      </div>
    </header>
  );
}

export default Header;