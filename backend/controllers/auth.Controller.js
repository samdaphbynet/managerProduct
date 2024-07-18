import User from "../models/user.model.js"
import bcrypt from 'bcrypt';
import { generateToken } from '../middleWare/generateToken.js';
import jwt from 'jsonwebtoken';

// register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                photo: newUser.photo,
                bio: newUser.bio,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            }
        });
    } catch (error) {
        console.log("Error creating user", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// login user
export const loginUser = async (req, res) => {
    try {
         const { email, password } = req.body;
         const user = await User.findOne({email});
         const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        // check if the the email or password is correct
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Email or password incorrect"});
        }

        // generate token
        generateToken(user._id, res)
        res.json({
            status: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                bio: user.bio,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        });
     } catch (error) {
        console.log("Error logging in user", error);
        res.status(500).json({error: "Internal Server Error"});
     }
}

// logout user
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0})
        res.json({status: true, message: "Logout successfully"});
    } catch (error) {
        console.log("Error logging out user", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (users.length < 1) {
            return res.status(404).json({error: "No users found"});
        }
        res.status(201).json({
            status: true,
            message: "All users",
            users: users
        })
    } catch (error) {
        console.log("Error in get all users", error)
        res.status(500).json({error: "Internal Server Error"});
    }
}

// get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.status(200).json({
            status: true,
            message: "Current user",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                bio: user.bio,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        })
    } catch (error) {
        console.log("Error in get current user", error)
        res.status(500).json({error: "Internal Server Error"});
    }
}

// loggedIn user
export const loggedInUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json(false);
        }
        const decoded = jwt.verify(token, process.env.SECRET_JWT)
        if (!decoded) {
            return res.status(401).json(false);
        }
        res.json(true);
    } catch (error) {
        console.log("Error in logged In", error)
        res.status(500).json({error: "Internal Server Error"});
    }
}