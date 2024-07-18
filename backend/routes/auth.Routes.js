import express from 'express';
import { getAllUsers, getCurrentUser, loggedInUser, loginUser, logoutUser, registerUser } from '../controllers/auth.Controller.js';
import { protectUser } from '../middleWare/protectUser.js';

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/all", getAllUsers)
router.get("/me", protectUser, getCurrentUser)
router.get("/loggedin", loggedInUser)


export default router;