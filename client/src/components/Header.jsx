import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import HighlightIcon from "@mui/icons-material/Highlight";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, loadingUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  function settings() {
    navigate("/settings");
  }

  function goNotes() {
    navigate("/notes");
  }

  if (loadingUser) return null;

  return (
    <header
      className="header-bar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
      }}
    >
      <h1>
        <HighlightIcon />
        Keeper
      </h1>

      <div
        className="header-user-nav"
        style={{ display: "flex", gap: "15px", alignItems: "center" }}
      >
        {user ? (
          <>
            <PersonIcon />
            <span>
              <strong>{user.email}</strong>
            </span>

            <button>
              {location.pathname === "/settings" ? (
                <NoteAltIcon onClick={goNotes} />
              ) : (
                <SettingsIcon onClick={settings} />
              )}
            </button>

            <button onClick={logout} className="logout-btn">
              <LogoutIcon />
            </button>
          </>
        ) : (
          <Link to="/register"></Link>
        )}
      </div>
    </header>
  );
}

export default Header;
