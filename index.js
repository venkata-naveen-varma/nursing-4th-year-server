import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import {connectToDB} from "./utils.js";
import indexRouter from "./routes/index.js";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";

mongoose.set('strictQuery', false);

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
// app.use(cors());
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Replace with your frontend's URL
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

app.use(cookieParser());
 
app.use(session({
    secret: "drthrthvfr",
    saveUninitialized: true,
    resave: true
}));

app.use("", indexRouter);

(async function init() {
    try {
        await connectToDB();
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    } catch (err) {
        console.warn(err);
    }
}());