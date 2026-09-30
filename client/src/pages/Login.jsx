import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleLoginClick(e) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await fetchUser();
        navigate("/notes");
      } else {
        console.log("Email or password is not valid");
        setErrorMessage(result.message || "Email or password is not valid");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(err?.message || "Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
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

        {errorMessage && (
          <div
            className="error-alert"
            style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1 }} disabled={isSubmitting}>
            Login
          </button>
          <button
            type="button"
            style={{ flex: 1 }}
            onClick={handleRegisterClick}
            disabled={isSubmitting}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
