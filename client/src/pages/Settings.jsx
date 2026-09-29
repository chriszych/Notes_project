import React from "react";
import "./../../public/styles.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";

function Settings() {
  const { user, loadingUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newEmail: "",
    newPassword: "",
    oldPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function updateEmail(event) {
    event.preventDefault();

    const newEmail = formData.newEmail;
    const password = formData.newPassword;

    try {
      const res = await fetch("/api/user/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password, newEmail }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.reload();
      } else {
        alert(data.message || "Error during e-mail update process");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Problem with server connection.");
    }
  }

  async function updatePassword(event) {
    event.preventDefault();

    const oldPassword = formData.oldPassword;
    const newPassword = formData.newPassword;

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.reload();
      } else {
        alert(data.message || "Error during password update process");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Problem with server connection.");
    }
  }

  async function deleteAccount() {
    if (
      !window.confirm(`Are you sure you want to delete ${user.email} account?`)
    )
      return;

    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        alert(`Your account: ${user.email} was successfully deleted.`);
        logout();
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Problem with server connection.");
    }
  }

  if (loadingUser) return null;

  return (
    <div className="settings-container">
      <h2 className="settings-title">
        <i className="fas fa-user-cog"></i> Account Settings
      </h2>

      <div className="settings-card">
        <h4>
          <i className="fas fa-info-circle"></i> Account info
        </h4>
        <p>
          <strong>added at: </strong>
          <span id="created">
            {new Date(user.created_at).toLocaleString("pl-PL")}
          </span>
        </p>
        <p>
          <strong>modified: </strong>
          <span id="updated">
            {new Date(user.updated_at).toLocaleString("pl-PL")}
          </span>
        </p>
      </div>

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
              value={formData.newEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="settings-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="newPassword"
              id="pass-confirm"
              autoComplete="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary-custom">
            Change Email
          </button>
        </form>
      </div>

      <div className="settings-card">
        <h4>
          <i className="fas fa-key"></i> Change Password
        </h4>
        <form id="pass-update" onSubmit={updatePassword}>
          <input
            type="text"
            name="username"
            value={user.email}
            autoComplete="username"
            style={{ display: "none" }}
            readOnly
          />

          <div className="settings-group">
            <label>Current Password</label>
            <input
              type="password"
              name="oldPassword"
              id="pass-old"
              autoComplete="current-password"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="settings-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              id="pass-new"
              required
              autoComplete="new-password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary-custom">
            Change Password
          </button>
        </form>
      </div>

      <div className="settings-card">
        <h4>
          <i
            className="fas fa-exclamation-triangle"
            style={{ color: "#e74c3c" }}
          ></i>{" "}
          Delete Account
        </h4>
        <p style={{ marginBottom: "12px", color: "#666" }}>
          Deleting your account is permanent. You will lose all your notes.
        </p>
        <button className="btn-danger-custom" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>

      <button className="btn-back" onClick={() => navigate("/notes")}>
        <i className="fas fa-arrow-left"></i> Back to Notes
      </button>
    </div>
  );
}

export default Settings;
