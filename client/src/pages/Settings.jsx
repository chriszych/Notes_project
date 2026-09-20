import React from "react";
import "./../../public/styles.css";
import { useNavigate } from "react-router-dom";

function Settings() {
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
          <strong>Created at:</strong> <span id="created">--</span>
        </p>
        <p>
          <strong>Last update:</strong> <span id="updated">--</span>
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
            <input type="email" name="newEmail" id="new-email" required />
          </div>

          <div className="settings-group">
            <label>Confirm Password</label>
            <input type="password" name="password" id="pass-confirm" required />
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
          <div className="settings-group">
            <label>Current Password</label>
            <input type="password" name="oldPassword" id="pass-old" required />
          </div>

          <div className="settings-group">
            <label>New Password</label>
            <input type="password" name="newPassword" id="pass-new" required />
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