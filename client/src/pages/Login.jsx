
import React, { useState } from "react";
import "./../../public/styles.css";

function Login() {


  return (
    <div className="login-wrapper">
      
      <form className="login">
      <h2>Login</h2>
        <input 
          type="email" 
          placeholder="e-mail"
        />

        <input 
          type="password" 
          placeholder="password"
        />
        {/* <div className="login-buttons"> */}
        <button type="submit">Login</button>
        {/* <button type="button">Register</button> */}
        {/* </div> */}
      </form>
    </div>
  )
}

export default Login;