import express from "express";
import {
    registerUser, loginUser, getUser, logoutUser, getUserDetails
} from "../controllers/users.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", Auth, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)
router.post("/details", getUserDetails);

export default router;
