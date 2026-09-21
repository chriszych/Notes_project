import React from "react";
import "./../../public/styles.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

function Settings() {

  const { user, loadingUser } = useContext(UserContext);

  const navigate = useNavigate();

  function updateEmail(event) {
    event.preventDefault();
    // Email update logic
  }

  function updatePassword(event) {
    event.preventDefault();
    // Password update logic
  }

  function deleteAccount() {
    // Account deletion logic
  }

  if (loadingUser) return null;
  //console.log(user);

  return (
    <div className="settings-container">
      <h2 className="settings-title">
        <i className="fas fa-user-cog"></i> Account Settings
      </h2>

      {/* User Information */}
      <div className="settings-card">
        <h4>
          <i className="fas fa-info-circle"></i> User Information
        </h4>
        <p>
          <strong>added at: </strong><span id="created">{new Date(user.created_at).toLocaleString('pl-PL')}</span>
        </p>
        <p>
          <strong>modified: </strong><span id="updated">{new Date(user.updated_at).toLocaleString('pl-PL')}</span>
        </p>
      </div>

      {/* Change Email */}
      <div className="settings-card">
        <h4>
          <i className="fas fa-envelope"></i> Change Email
        </h4>
        <form id="email-update" onSubmit={updateEmail}>
          <div className="settings-group">
            <label>New Email</label>
            <input 
              type="email" 
              name="newEmail" 
              id="new-email" 
              autoComplete="new-email"
              required />
          </div>

          <div className="settings-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="password" 
              id="pass-confirm" 
              autoComplete="password"
              required 
            />
          </div>

          <button type="submit" className="btn-primary-custom">
            Change Email
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="settings-card">
        <h4>
          <i className="fas fa-key"></i> Change Password
        </h4>
        <form id="pass-update" onSubmit={updatePassword}>

          {/* Ukryte pole na nazwę użytkownika/email wymagane przez przeglądarki */}
  <input 
    type="text" 
    name="username" 
    value={user.email} // Przekaż tutaj login/email zalogowanego użytkownika
    autoComplete="username" 
    style={{ display: "none" }} 
    readOnly 
  />

          <div className="settings-group">
            <label>Current Password</label>
            <input 
              type="password" 
              name="old-password" 
              id="pass-old" 
              autoComplete="current-password"
              required />
          </div>

          <div className="settings-group">
            <label>New Password</label>
            <input 
              type="password" 
              name="new-password" 
              id="pass-new" 
              required 
              autoComplete="new-password"
              />
          </div>

          <button type="submit" className="btn-primary-custom">
            Change Password
          </button>
        </form>
      </div>

      {/* Danger Zone / Delete Account */}
      <div className="settings-card">
        <h4>
          <i className="fas fa-exclamation-triangle"></i> Danger Zone
        </h4>
        <p style={{ marginBottom: "12px", color: "#666" }}>
          Deleting your account is permanent. You will lose access to all your notes.
        </p>
        <button className="btn-danger-custom" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>

      {/* Back Button */}
      <button className="btn-back" onClick={() => navigate("/notes")}>
        <i className="fas fa-arrow-left"></i> Back to Notes
      </button>
    </div>
  );
}

export default Settings;