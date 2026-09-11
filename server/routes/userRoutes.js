import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";

import {
  homePage,
  loginPage,
  registerPage,
  userPage,
  //addUser,
  //loginUser,
  //logoutUser,
  //editUserForm,
  //deleteUser,
  //updatePassword,
  //updateEmail,
} from "../controllers/userViewController.js";

const router = express.Router();

router.use(methodOverride);

router.get("/", homePage);
router.get("/login", loginPage); // /api/login
router.get("/register", registerPage); // /api/register
router.get("/user", auth, userPage);//router.get("/api/user", auth, editUserForm);
//router.post("/logout", logoutUser);
//router.put("/logout", logoutUser); //router.get("/api/logout", logoutUser);

// router.post("/api/register", addUser);
// router.post("/api/login", loginUser);
// router.get("/api/logout", logoutUser);

// router.delete("/api/user", auth, deleteUser);
// router.put("/api/user/password", auth, updatePassword);
// router.put("/api/user/email", auth, updateEmail);

export default router;