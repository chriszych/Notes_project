import React, { useState } from "react";
import "./../../public/styles.css";
import { useNavigate } from "react-router-dom";

function Settings () {

return(
<div class="container mt-5">

  <h2 class="mb-4">
    <i class="fas fa-user-cog fa-2x"></i> Ustawienia konta
  </h2>

  {/* <!-- Dane użytkownika --> */}
  <div class="card mb-4">
    <div class="card-body">
      <h4>Dane użytkownika</h4>
      {/* <p><strong>Email:</strong> <%= user.email %></p> */}
      {/* <!-- <p><strong>Utworzono:</strong> <= new Date(user.created_at).toLocaleString('pl-PL') %></p> */}
      {/* <p><strong>Ostatnia aktualizacja:</strong> </p> */}
      <p><strong>Utworzono:</strong> <span id="created"></span></p>
        <p><strong>Ostatnia aktualizacja:</strong> <span id="updated"></span></p>

    </div>
  </div>

  {/* <!-- Zmiana emaila --> */}
  <div class="card mb-4">
    <div class="card-body">
      <h4><i class="fas fa-envelope, btn btn-dark"></i> Zmień email</h4>

      {/* <!-- <form action="/api/user/email" method="POST"> --> */}
      <form id="email-update">
         {/* <!-- <input type="hidden" name="_method" value="PUT"> --> */}
        <div class="mb-3">
          <label class="form-label">Nowy email</label>
          <input type="email" name="newEmail" class="form-control" id="new-email" required></input>
        </div>

        <div class="mb-3">
          <label class="form-label">Potwierdź hasło</label>
          <input type="password" name="password" class="form-control" id="pass-confirm" required></input>
        </div>

        {/* <!-- <button class="btn btn-primary">Zmień email</button> --> */}
        <button onclick="updateEmail(event)">Zmień email</button>
      </form>
    </div>
  </div>

{/* <!-- Zmiana hasła --> */}
<div class="card mb-4">
  <div class="card-body">
    <h4><i class="fas fa-key"></i> Zmień hasło</h4>
    <form id="pass-update">
      <div class="mb-3">
        <label class="form-label">Stare hasło</label>
        <input type="password" name="oldPassword" class="form-control" id="pass-old" required></input>
      </div>

      <div class="mb-3">
        <label class="form-label">Nowe hasło</label>
        <input type="password" name="newPassword" class="form-control" id="pass-new" required></input>
      </div>

      <button type="submit" onclick="updatePassword(event)" class="btn btn-dark">Zmień hasło</button>
    </form>
  </div>
</div>

  {/* <!-- Usunięcie konta --> */}
  <div class="card mb-4">
    <div class="card-body"></div>
        <button class="btn btn-danger" onclick="deleteAccount()">Usuń konto</button>


    </div>


<a href="/notes" class="btn btn-secondary">
  <i class="fas fa-arrow-left"></i> Powrót
</a>
</div>
)

}

export default Settings;