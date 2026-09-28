import React, { useState } from "react";
import "./../../public/styles.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setErrorMessage("");
    setSuccessMessage("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleLoginClick() {
    navigate("/");
  }

  async function handleRegisterClick(e) {
    e.preventDefault();
    let result = null;

    try {
      const response = await fetch("/api/register", {
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

      result = await response.json();

      if (response.ok && result.success) {
        setFormData({ email: "", password: "" });
        setSuccessMessage(result.message || "Użytkownik dodany, zaloguj się!");
      } else {
        setFormData({ email: "", password: "" });
        setErrorMessage(result.message || "Wystąpił błąd podczas rejestracji.");
      }
    } catch (err) {
      setErrorMessage(
        result?.message ||
          err.message ||
          "Wystąpił problem z połączeniem z serwerem."
      );
    }
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
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          required
          placeholder="password"
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
        {successMessage && (
          <div
            className="error-alert"
            style={{ color: "green", marginBottom: "15px", fontSize: "14px" }}
          >
            {successMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1 }}>
            Register
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
