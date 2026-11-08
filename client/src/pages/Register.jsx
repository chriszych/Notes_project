import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleLoginClick() {
    navigate("/");
  }

  const {
    mutate: registerUserMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await axios.post(
        "/api/register",
        { username, password },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error during registration");
      }

      return response.data;
    },
    onSuccess: (data) => {
      setFormData({ email: "", password: "" });
      setSuccessMessage(data.message || "User added, try login");
    },
    onError: (err) => {
      setFormData((prev) => ({ ...prev, password: "" }));
    },
  });

  async function handleRegisterClick(e) {
    e.preventDefault();

    registerUserMutation({
      username: formData.email,
      password: formData.password,
    });
  }

  return (
    <div className="login-wrapper">
      <form className="login" onSubmit={handleRegisterClick}>
        <h2>User registration</h2>
        <input
          type="email"
          name="email"
          required
          placeholder="e-mail"
          autoComplete="username"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          required
          placeholder="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />

        {isError && (
          <div
            className="error-alert"
            style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
          >
            {error.message || "Error during registration."}
          </div>
        )}
        {isSuccess && successMessage && (
          <div
            className="error-alert"
            style={{ color: "green", marginBottom: "15px", fontSize: "14px" }}
          >
            {successMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1 }} disabled={isPending}>
            {isPending ? "Registering..." : "Register"}
          </button>
          <button type="button" style={{ flex: 1 }} onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
