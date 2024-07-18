import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import {v2 as cloudinary} from "cloudinary"
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from "../utils/sendEmail.js";

// update user
export const updateUser = async (req, res) => {
    const {name, email, currentPassword, newPassword, phone, bio} = req.body;
    let {photo} = req.body;
    const userId = req.user._id;

    try {
        //find user by id
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        // check if the current password and new password not empty
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({error: 'Please enter both current password and new password'});
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({error: "current password is incorrect"});
            }
            user.password = newPassword;
        }

        // update image
        // let newUrlPhoto = user.photo;
        if (photo) {
            if (user.photo) {
                await cloudinary.uploader.destroy(user.photo.split("/").pop().split(".")[0]);
            }
            const uploaderResponse = await cloudinary.uploader.upload(photo)
            photo = uploaderResponse.secure_url;
        }

        // update user details
        user.name = name || user.name;
        user.email = email;
        user.phone = phone || user.phone;
        user.bio = bio || user.bio;
        user.photo = photo || user.photo;

        await user.save();

        // delete password from response
        const response = user.toObject();
        delete response.password;
        return res.status(200).json({
            status: true,
            message: "User profile updated successfully",
            user: response,
        });
    
    } catch (error) {
        console.log("Error in update user profile", error)
        res.status(500).json({error: "Internal Server Error"});
    }
}

// forgot password user
export const forgotPasswordUser = async (req, res) => {
    try {
        const {email} = req.body;
        // find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        // find and delete token
        const token = await Token.findOne({userId: user._id});
        if (token) {
            await token.deleteOne();
        }

        // generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
        
        // hash token and save it in db
        const hashToken = crypto.createHash('sha256').update(resetToken).digest("hex");

        const newToken = new Token({
            userId: user._id,
            token: hashToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
        })
        await newToken.save();

        // construct reset url
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        // reset email
        const message = `
            <h2>Bonjour ${user.name}</h2>
            <p>Vous avez demandé un changement de mot de passe pour votre compte sur notre site.</p>
            <p>Ce lien est valide pour 30min</p>
            <p>Merci de vous rendre à <a href="${resetUrl}">${resetUrl}</a> pour réinitialiser votre mot de passe.</p>
        `;

        const send_from = process.env.EMAIL_USER;
        const send_to = user.email;
        const subject = "Password Reset Request";

        try {
            await sendEmail(send_from, send_to, subject, message)
            return res.status(200).json({
                status: true,
                message: "Reset password link sent to your email",
            })
        } catch (error) {
            console.log("Error in sendEmail controller: ", error)
            return res.status(500).json({error: "Error sending email"})
        }
    } catch (error) {
        console.log("Error in forgot password user", error)
        return res.status(500).json({error: "Internal Server Error"});
    }
}

// reset password user
export const resetPassword = async (req, res) => {
    const {password} = req.body;
    const {resetToken} = req.params;
    try {
        // hashed token
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // find token in db
        const userToken = await Token.findOne({token: hashedToken, expiresAt: {$gt: Date.now()}});

        if (!userToken) {
            return res.status(404).json({error: "Invalid or expired reset token"});
        }

        // find user by id
        const user = await User.findOne({_id: userToken.userId});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        user.password = password;

        await user.save();

        // delete token
        await userToken.deleteOne();

        return res.status(200).json({
            status: true,
            message: "Password reset successfully",
        })
    } catch (error) {
        console.log("Error in reset password", error)
        return res.status(500).json({error: "Internal Server Error"});
    }
}