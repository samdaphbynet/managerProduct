import express from 'express';
import { forgotPasswordUser, resetPassword, updateUser } from '../controllers/user.controller.js';
import {protectUser} from '../middleWare/protectUser.js';

const router = express.Router();

router.post("/update", protectUser, updateUser);
router.post("/forgotpassword", forgotPasswordUser);
router.put("/resetpassword/:resetToken", resetPassword)

export default router;