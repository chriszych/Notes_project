import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";

import {
  addUser,
  loginUser,
  logoutUserApi,
  getUserData,
  deleteUser,
  updatePassword,
  updateEmail,
} from "../controllers/userApiController.js";

const router = express.Router();

router.use(methodOverride);

router.post("/login", loginUser);
router.post("/register", addUser);
router.post("/logout", logoutUserApi);

router.get("/user", auth, getUserData);
router.put("/user/email", auth, updateEmail);
router.put("/user/password", auth, updatePassword);
router.delete("/user", auth, deleteUser);

export default router;