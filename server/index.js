import https from "https";
import fs from "fs";
import express from "express";
import bcrypt from "bcrypt";

import cookieParser from "cookie-parser";



import db from "../server/config/db.js";
import auth from "../server/middleware/auth.js";
import methodOverride from "./middleware/methodOverride.js";



const app = express();

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
//app.use(methodOverride("_method"));

app.use(methodOverride());

const port = 3000;
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/api/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/api/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/api/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //Password hashing
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          res.render("login.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      //comparing hashed password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.log("Error comparing the passwords:", err);
        } else {
          if (result) {
            // 🔥 TU TWORZYSZ JWT Z ID UŻYTKOWNIKA
            const token = jwt.sign(
              { id: user.id, email: user.email },
              JWT_SECRET,
              { expiresIn: "1h" }
            );

            // 🔥 Zapisujesz token w ciasteczku HttpOnly
            res.cookie("token", token, {
              httpOnly: true,
              secure: true, // w produkcji → true
              sameSite: "none",
            });

            res.redirect("/api/notes");
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/notes", auth, async (req, res) => {
  const userId = req.user.id;
  const notes = await db.query(
    "SELECT * FROM notes WHERE id_user = $1 ORDER BY updated_at DESC, created_at DESC",
    [userId]
  );

  res.render("notes.ejs", {
    notes: notes.rows,
    userId,
    email: req.user.email,
  });
});

app.get("/api/logout", (req, res) => {
  res.clearCookie("token"); // usuwa JWT z ciasteczka
  res.redirect("/api/login"); // przekierowanie
});

app.get("/api/user", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT email, created_at, updated_at FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.render("user.ejs", {
        user,
      });
    } else {
      res.send("No user data found!");
    }
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Problem with getting user data!", err });
  }
});

app.delete("/api/user", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, email",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Problem with deleting user!", err });
  }
});

app.put("/api/user/password", auth, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // pobieramy aktualne hasło
    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedHash = result.rows[0].password;

    // sprawdzamy stare hasło
    const match = await bcrypt.compare(oldPassword, storedHash);
    if (!match) {
      return res.status(403).json({ message: "Incorrect old password" });
    }

    // haszujemy nowe hasło
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    // zapisujemy nowe hasło
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      newHash,
      userId,
    ]);

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Problem with updating password!",
      err,
    });
  }
});

app.put("/api/user/email", auth, async (req, res) => {
  const userId = req.user.id;
  const { password, newEmail } = req.body;

  try {
    // pobieramy aktualne hasło
    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedHash = result.rows[0].password;

    // sprawdzamy stare hasło
    const match = await bcrypt.compare(password, storedHash);
    if (!match) {
      return res.status(403).json({ message: "Incorrect old password" });
    }

    // zapisujemy nowy email
    await db.query("UPDATE users SET email = $1 WHERE id = $2", [
      newEmail,
      userId,
    ]);

    const newToken = jwt.sign({ id: userId, email: newEmail }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", newToken, { httpOnly: true });

    return res.json({ message: "Email updated successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Problem with updating email!",
      err,
    });
  }
});

app.get("/api/notes/new", auth, (req, res) => {
  res.render("noteForm", 
  { 
    mode: "create", 
    note: null 
    });
});

app.post("/api/notes", auth, async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  try {
    const result = await db.query("INSERT INTO notes (id_user, title, text) VALUES ($1, $2, $3) RETURNING id", 
    [
      userId,
      title,
      content
    ]);

    if(!result.rowCount){
      return res.status(403).json({ message: "Note not added!" });
    }

    return res.redirect("/api/notes");

  }catch(err){
      return res.status(500).json({
      message: "Problem with adding note!",
      err,
    });
  }
});

app.get("/api/notes/:id/edit/", auth, async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  try {

    const result = await db.query("SELECT * FROM notes WHERE id = $1 AND id_user = $2",
    [
      noteId,
      userId
      ]);

    if(result.rowCount === 0){
      return res.status(404).json({ message: "Note not found!" });
    }

    const note = result.rows[0];

    return res.render("noteForm", {
      mode: "edit",
      note: {
        title: note.title,
        content: note.text,
        id: note.id
      }
    });

  } catch(err){
      return res.status(500).json({
      message: "Problem with getting edited note!",
      err,
    });
  }
});

app.put("/api/notes/:id", auth, async (req, res) => {

  const userId = req.user.id;
  const noteId = Number(req.params.id);
  const { title, content } = req.body;

  //console.log(noteId);
  if (isNaN(noteId)) {
  return res.status(400).json({ message: "Invalid note ID" });
  }

  try{

    const result = await db.query("UPDATE notes SET title = $1, text = $2 WHERE id = $3 AND id_user = $4",
    [
      title,
      content,
      noteId,
      userId
      ]);
    
    //add returning for REACT

    if (result.rowCount === 0) {
      return res.status(403).json({ message: "Note not updated!" });
    }

    // for EJS
    return res.redirect("/api/notes");
    //for React
    //return res.json({ message: "Note updated successfully" });

  }catch(err){
      return res.status(500).json({
      message: "Problem with saving edited note!",
      err,
    });
  }

});

app.delete("/api/notes/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const noteId = Number(req.params.id);
  
    if (isNaN(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
    }

  try {

    const result = await db.query("DELETE FROM notes WHERE id = $1 AND id_user = $2",
    [
      noteId,
      userId
      ]);

    if(result.rowCount === 0){
      return res.status(404).json({ message: "Note not deleted!" });
    }
  //for React
  //return res.json({ message: "Note deleted successfully" });
  return res.redirect("/api/notes");

  } catch(err){
      return res.status(500).json({
      message: "Problem with getting deleted note!",
      err,
    });
  }
});

/*endpointy do zrobienia
USERS
(+) GET /api/user - pobranie danych uzytkownika
(+) PUT /api/user/email - zmiana email
(+) PUT /api/user/password - zmiana hasła
(+) DELETE /api/user - usunięcie konta
(--)przed usunieciem konta usunac notatki uzytkownika

NOTES CRUD
(+)POST /api/notes - dodanie notatki
(+)GET /api/notes/:id - pobranie notatki o danym id
(+)PUT /api/notes/:id - aktualizacja notatki o danyn id
DELETE /api/notes/:id - usuniecie notatki o danym id
*/

//app.use(express.static("public"));
//console.log(">>> ROUTES END <<<");
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on https://localhost:${port}`);
});
