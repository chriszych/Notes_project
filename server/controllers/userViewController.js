//import bcrypt from "bcrypt";
//import db from "../config/db.js";
//import { generateToken, jwtCookieOptions } from "../config/jwt.js";

//const saltRounds = 10;

/*
  homePage,
  loginPage,
  registerPage,
  addUser,
  loginUser,
  logoutUser,
  editUserForm,
  deleteUser,
  updatePassword,
  updateEmail,
*/

export function homePage(req, res) {
  res.render("home.ejs");
}

export function loginPage(req, res) {
  res.render("login.ejs");
}


export function registerPage(req, res) {
  res.render("register.ejs");
}

export function userPage(req, res) {
  res.render("user.ejs", {
    user: req.user
  });
}

// export function logoutUser(req, res) {
//   res.clearCookie("token"); // usuwa JWT z ciasteczka
//   res.redirect("/login"); // przekierowanie
// }
// export async function editUserForm(req, res) {

//   const userId = req.user.id;

//   try {
//     const result = await db.query(
//       "SELECT email, created_at, updated_at FROM users WHERE id = $1",
//       [userId]
//     );
//     if (result.rows.length > 0) {
//       const user = result.rows[0];
//       res.render("user.ejs", {
//         user,
//       });
//     } else {
//       res.send("No user data found!");
//     }
//   } catch (err) {
//     return res
//       .status(403)
//       .json({ message: "Problem with getting user data!", err });
//   }
// }

// export function logoutUser(req, res) {

//   res.clearCookie("token"); // usuwa JWT z ciasteczka
//   res.redirect("/login"); // przekierowanie
// }




