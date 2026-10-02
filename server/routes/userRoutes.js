import express from "express";
import auth from "../middleware/auth.js";
import methodOverride from "../middleware/methodOverride.js";

import {
  homePage,
  loginPage,
  registerPage,
  userPage,

} from "../controllers/userViewController.js";

const router = express.Router();

router.use(methodOverride);

router.get("/", homePage);
router.get("/login", loginPage); 
router.get("/register", registerPage); 
router.get("/user", auth, userPage);

export default router;