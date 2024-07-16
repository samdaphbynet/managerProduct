import User from "../models/user.js"
import { generateToken } from '../middleWare/generateToken.js';

// create user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({error: "All fields are required"});
        }
        // check length of password
        if (password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters long"});
        }
        // find user by email
        const user = await User.findOne({email});
        if (user) return res.status(400).json({error: "Email already exists"});

        // create new user and save to db
        const newUser = await User.create({
            name,
            email, 
            password
        })

        // generate token
        generateToken(newUser._id, res)
        res.status(201).json({
            status: true,
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        console.log("Error creating user", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}