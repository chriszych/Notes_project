import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;

// generowanie tokenu
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

// weryfikacja tokenu
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// opcje ciasteczka JWT
export const jwtCookieOptions = {
  httpOnly: true,
  secure: true,      // w produkcji true, lokalnie możesz dać false
  sameSite: "none",
};
