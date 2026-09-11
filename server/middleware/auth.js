import { verifyToken } from "../config/jwt.js";

export default function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Brak tokenu, wymagane logowanie" 
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Nieprawidłowy lub wygasły token" 
    });
  }
}