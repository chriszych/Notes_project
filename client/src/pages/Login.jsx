import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: LoginUserMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await axios.post(
        "/api/login",
        { username, password },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Błąd logowania");
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/notes");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleLoginClick(e) {
    e.preventDefault();
    LoginUserMutation({
      username: formData.email,
      password: formData.password,
    });
  }

  function handleRegisterClick() {
    navigate("/register");
  }

  return (
    <div className="login-wrapper">
      <form className="login" onSubmit={handleLoginClick}>
        <h2>Login</h2>
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
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />

        {isError && (
          <div
            className="error-alert"
            style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
          >
            {error?.message || "Błąd logowania"}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1 }} disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            style={{ flex: 1 }}
            onClick={handleRegisterClick}
            disabled={isPending}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
