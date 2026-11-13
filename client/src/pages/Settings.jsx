import React from "react";
import "./../../public/styles.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Settings() {
  const queryClient = useQueryClient();

  const { user, loadingUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newEmail: "",
    confirmPassword: "",
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

  const { mutate: updateEmailMutation } = useMutation({
    mutationFn: async ({ password, newEmail }) => {
      const response = await axios.put(
        "/api/user/email",
        {
          password,
          newEmail,
        },
        {
          withCredentials: true,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload();
    },
  });

  const { mutate: updatePasswordMutation } = useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const response = await axios.put(
        "/api/user/password",
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload();
    },
  });

  const { mutate: deleteAccountMutation } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        "/api/user",
        {},
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      alert(`Your account: ${user.email} was successfully deleted.`);
      logout();
      navigate("/");
    },
  });

  async function updateEmail(event) {
    event.preventDefault();

    updateEmailMutation({
      password: formData.confirmPassword,
      newEmail: formData.newEmail,
    });
  }

  async function updatePassword(event) {
    event.preventDefault();

    updatePasswordMutation({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  }

  async function deleteAccount() {
    if (
      !window.confirm(`Are you sure you want to delete ${user.email} account?`)
    )
      return;

    deleteAccountMutation();
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
              name="confirmPassword"
              id="pass-confirm"
              autoComplete="current-password"
              value={formData.confirmPassword}
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
