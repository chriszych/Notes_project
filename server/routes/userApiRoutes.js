import express from "express";
import auth from "../middleware/auth.js";

import {
  addUser,
  loginUser,
  logoutUser,
  getUserData,
  deleteUser,
  updatePassword,
  updateEmail,
} from "../controllers/userApiController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", addUser);
router.post("/logout", logoutUser);

router.get("/user", auth, getUserData);
router.put("/user/email", auth, updateEmail);
router.put("/user/password", auth, updatePassword);
router.delete("/user", auth, deleteUser);

export default router;