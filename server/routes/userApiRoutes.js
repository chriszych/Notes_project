import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";

import {
//   homePage,
//   loginPage,
//   registerPage,
  addUser,
  loginUser,
  logoutUserApi,
 // editUserForm,
  getUserData,
  deleteUser,
  updatePassword,
  updateEmail,
} from "../controllers/userApiController.js";

const router = express.Router();

router.use(methodOverride);

// router.get("/", homePage);
// router.get("/api/login", loginPage);
// router.get("/api/register", registerPage);

router.post("/login", loginUser);//router.post("/api/login", loginUser);
router.post("/register", addUser);//router.post("/api/register", addUser);
router.post("/logout", logoutUserApi);//router.get("/api/logout", logoutUser);

router.get("/user", auth, getUserData);//router.get("/api/user", auth, editUserForm);
router.put("/user/email", auth, updateEmail); //router.put("/api/user/email", auth, updateEmail);
router.put("/user/password", auth, updatePassword);//router.put("/api/user/password", auth, updatePassword);
router.delete("/user", auth, deleteUser);

export default router;