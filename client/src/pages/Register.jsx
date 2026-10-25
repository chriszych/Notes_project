import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "/api/register",
        {
          username: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setFormData({ email: "", password: "" });
        setSuccessMessage(response.data.message || "User added, try login");
        return;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status >= 500) {
          console.error("Register server error:", err);
          setErrorMessage("Server error. Please try again later.");
        } else {
          setFormData((prev) => ({ ...prev, password: "" }));
          setErrorMessage(
            err.response.data?.message || "Error during registration."
          );
        }
      } else {
        console.error("Register request error:", err);
        setErrorMessage("Server connection error.");
      }
    } finally {
      setIsSubmitting(false);
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
          <button type="submit" style={{ flex: 1 }} disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
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
