import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 5000;

// connection mongodb
dbConnection()

app.listen(PORT, (req, res) => {
    console.log('Server is running on port 3000');
})

export default app;