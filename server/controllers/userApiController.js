import bcrypt from "bcrypt";
import db from "../config/db.js";
import { generateToken, jwtCookieOptions } from "../config/jwt.js";

const saltRounds = 10;

/*
  addUser,
  loginUser,
  logoutUserApi,
  getUserData,
  deleteUser,
  updatePassword,
  updateEmail,
*/

export async function addUser(req, res) {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // sprawdzenie czy email istnieje
    const checkResult = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Try logging in."
      });
    }

    // hashowanie hasła
    const hash = await bcrypt.hash(password, saltRounds);

    // zapis użytkownika
    await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hash]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      //redirect: "/login"
    });

  } catch (err) {
    //console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error creating user",
      err
    });
  }
}


export async function loginUser(req, res) {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];
    const storedHashedPassword = user.password;

    const match = await bcrypt.compare(loginPassword, storedHashedPassword);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.cookie("token", token, jwtCookieOptions);

    return res.json({
      success: true,
      message: "Login successful",
      //redirect: "/api/notes"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Problem with logging in!",
      //err
    });
  }
}


export function logoutUserApi(req, res) {
try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Successfully logged out"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error during logout"
    });
  }
}

export async function getUserData(req, res) {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT email, created_at, updated_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
        });
    }

    res.json({
      success: true,
      message: "Data fetched successfully",
      data: result.rows[0]});

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Problem with getting user data!",
      //err,
    });
  }
}

export async function deleteUser(req, res) {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, email",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("token");
    //for EJS only
    //res.redirect("/");
    //API first
    return res.json({
      success: true,
      //redirect: "/",
      message: "User deleted",
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Problem with deleting user!",
      err,
    });
  }
}

export async function updatePassword(req, res) {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // pobieramy aktualne hasło
    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const storedHash = result.rows[0].password;

    // sprawdzamy stare hasło
    const match = await bcrypt.compare(oldPassword, storedHash);
    if (!match) {
      return res.status(403).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    // haszujemy nowe hasło
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    // zapisujemy nowe hasło
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      newHash,
      userId,
    ]);

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Problem with updating password!",
      err,
    });
  }
}

export async function updateEmail(req, res) {
  const userId = req.user.id;
  const { password, newEmail } = req.body;

//console.log(password, newEmail);

    if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  if (password === undefined || newEmail === undefined) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required!",
    });
  }

  try {
    // pobieramy aktualne hasło
    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
        });
    }

    const storedHash = result.rows[0].password;

    // sprawdzamy stare hasło
    const match = await bcrypt.compare(password, storedHash);
    if (!match) {
      return res.status(403).json({ 
        success: false,
        message: "Incorrect old password" 
        });
    }

    // zapisujemy nowy email
    await db.query("UPDATE users SET email = $1 WHERE id = $2", [
      newEmail,
      userId,
    ]);

    // const newToken = jwt.sign({ id: userId, email: newEmail }, JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    const newToken = generateToken({ id: userId, email: newEmail });

    //res.cookie("token", newToken, { httpOnly: true });
    res.cookie("token", newToken, jwtCookieOptions);

    return res.json({ 
      success: true,
      message: "Email updated successfully" 
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Problem with updating email!",
      err,
    });
  }
}
