import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from "cloudinary";
import authControlle from "./routes/auth.Routes.js"
import userControlle from "./routes/user.routes.js"

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/auth/", authControlle);
app.use("/api/user/", userControlle);

// connection mongodb
dbConnection()

app.listen(PORT, (req, res) => {
    console.log('Server is running on port 3000');
})