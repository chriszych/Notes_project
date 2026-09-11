
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
//import "/styles.css";

function Login() {

const navigate = useNavigate();
const { fetchUser } = useContext(UserContext); 
const [formData, setFormData] = useState({
  email: "",
  password: ""
});

const [errorMessage, setErrorMessage] = useState("");

// Uniwersalna funkcja aktualizująca stan na podstawie atrybutu 'name'
  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


async function handleLoginClick (e) {
  e.preventDefault();

 try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Zapewnia poprawną obsługę ciasteczek sesyjnych
        body: JSON.stringify({ username: formData.email, password: formData.password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // window.location.href = '/notes';
        await fetchUser();
        navigate("/notes");
      } else {
        //errorDiv.innerText = result.message || 'Nieprawidłowy email lub hasło.';
        //errorDiv.style.display = 'block';
        console.log('Nieprawidłowy email lub hasło');
        setErrorMessage(result.message);
      }
    } catch (err) {
      console.error('Błąd logowania:', err);
      setErrorMessage(err);
      //errorDiv.innerText = 'Wystąpił problem z połączeniem z serwerem.';
      //errorDiv.style.display = 'block';
    }

}

    function handleRegisterClick(){
      // window.location.href = '/register';
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

        {/* 2. Wyświetlanie komunikatu o błędzie, jeśli istnieje */}
        {errorMessage && (
          <div className="error-alert" style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
            {errorMessage}
          </div>
        )}

        {/* <div className="login-buttons"> */}
<div style={{ display: "flex", gap: "10px" }}>
  <button type="submit" style={{ flex: 1 }}>Login</button>
  <button type="button" style={{ flex: 1 }} onClick={handleRegisterClick}>Register</button>
</div>
        {/* <button type="button">Register</button> */}
        {/* </div> */}
      </form>
    </div>
  )
}

export default Login;