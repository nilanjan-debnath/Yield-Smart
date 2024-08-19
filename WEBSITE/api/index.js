import express from "express";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import diagonesisRoute from "./routes/diagonesis.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("mongodb is connected");
}).catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.listen(3000, ()=> {
    console.log("server is running port 3000");
});

// write route here
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/diagonesis", diagonesisRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// error handle middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

