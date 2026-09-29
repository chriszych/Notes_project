import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export const jwtCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};
