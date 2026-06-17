
import React, { useState } from "react";
import "./../../public/styles.css";

function Register(){

  return (
    <div className="login-wrapper">
      
      <form className="login">
      <h2>Registration</h2>
        <input 
          type="email" 
          placeholder="e-mail"
        />

        <input 
          type="password" 
          placeholder="password"
        />

        <button type="submit">Register</button>
      </form>
    </div>
  )

}



export default Register;