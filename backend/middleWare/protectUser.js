import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectUser = async (req, res, next) => {
    try {
        // check if token is valid
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({error: "Unauthorized no token provided"});
        }

        // decoded token
        const decoded = jwt.verify(token, process.env.SECRET_JWT)
        if (!decoded) {
            return res.status(401).json({error: "Unauthorized token is invalid"});
        }

        // find user by id
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(401).json({error: "User does not exist"});
        }

        // add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.log("Error while verifying token", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}