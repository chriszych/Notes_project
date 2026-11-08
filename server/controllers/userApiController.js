import bcrypt from "bcryptjs";
import db from "../config/db.js";
import { generateToken, JWT_MAX_AGE_MS, jwtCookieOptions } from "../config/jwt.js";

const saltRounds = 10;

export async function addUser(req, res) {
  const email = req.body.username?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    console.log("Email and password are required");
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (password.length < 8) {
    console.log("Password must be at least 8 characters");
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const checkResult = await db.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (checkResult.rows.length > 0) {
    console.log("Email already exists. Try logging in.");
    return res.status(409).json({
      success: false,
      message: "Email already exists. Try logging in.",
    });
  }

  const hash = await bcrypt.hash(password, saltRounds);

  await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
    email,
    hash,
  ]);

  return res.status(201).json({
    success: true,
    message: "User created successfully, try login",
  });
}

export async function loginUser(req, res) {
  const email = req.body.username;
  const loginPassword = req.body.password;

  const INVALID_CREDENTIALS_MESSAGE = {
    success: false,
    message: "Incorrect user or password",
  };
  const result = await db.query(
    "SELECT id, email, password FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    console.log("User name not found");
    return res.status(401).json(INVALID_CREDENTIALS_MESSAGE);
  }

  const storedHashedPassword = user.password;

  const match =
    user && (await bcrypt.compare(loginPassword, storedHashedPassword));

  if (!match) {
    console.log("Password does not match");
    return res.status(401).json(INVALID_CREDENTIALS_MESSAGE);
  }

  const token = generateToken({ id: user.id, email: user.email });

  res.cookie("token", token, { ...jwtCookieOptions, maxAge: JWT_MAX_AGE_MS });
  
  return res.json({
    success: true,
    message: "Login successful",
  });
}

export function logoutUser(req, res) {

  res.clearCookie("token", jwtCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
}

export async function getUserData(req, res) {
  const userId = req.user.id;

  const result = await db.query(
    "SELECT email, created_at, updated_at FROM users WHERE id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    console.log("User not found");
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "Data fetched successfully",
    data: result.rows[0],
  });
}

export async function deleteUser(req, res) {
  const userId = req.user.id;

  const result = await db.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, email",
    [userId]
  );

  if (result.rowCount === 0) {
    console.log("User not found");
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.clearCookie("token", jwtCookieOptions);

  return res.json({
    success: true,
    message: "User deleted",
  });
}

export async function updatePassword(req, res) {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const result = await db.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);

  if (result.rows.length === 0) {
    console.log("User not found");
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const storedHash = result.rows[0].password;

  const match = await bcrypt.compare(oldPassword, storedHash);

  if (!match) {
    console.log("Incorrect old password");
    return res.status(403).json({
      success: false,
      message: "Incorrect old password",
    });
  }

  const newHash = await bcrypt.hash(newPassword, saltRounds);

  await db.query("UPDATE users SET password = $1 WHERE id = $2", [
    newHash,
    userId,
  ]);

  return res.json({
    success: true,
    message: "Password updated successfully",
  });
}

export async function updateEmail(req, res) {
  const userId = req.user.id;

  const { password, newEmail } = req.body;

  if (password === undefined || newEmail === undefined) {
    console.log("e-mail and password are required!");
    return res.status(400).json({
      success: false,
      message: "e-mail and password are required!",
    });
  }

  const result = await db.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);

  if (result.rows.length === 0) {
    console.log("User not found");
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const storedHash = result.rows[0].password;
  const match = await bcrypt.compare(password, storedHash);

  if (!match) {
    console.log("Incorrect old password");
    return res.status(403).json({
      success: false,
      message: "Incorrect old password",
    });
  }

  await db.query("UPDATE users SET email = $1 WHERE id = $2", [
    newEmail,
    userId,
  ]);

  const newToken = generateToken({ id: userId, email: newEmail });
  res.cookie("token", newToken, { ...jwtCookieOptions, maxAge: JWT_MAX_AGE_MS });

  return res.json({
    success: true,
    message: "Email updated successfully",
  });
}
