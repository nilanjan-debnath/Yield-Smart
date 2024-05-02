import express from "express";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import geminiRoute from "./routes/gmini.route.js";
import {GoogleGenerativeAI} from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyD4m_SJwfJStsKL2VN7bbjAbC50t-GSN7c");


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("mongodb is connected");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());

app.listen(3000, ()=> {
    console.log("server is running port 3000");
});

// write route here
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/gemini", geminiRoute);

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

// async function run() {
//     // For text-only input, use the gemini-pro model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
//     const prompt = "Write a story about a magic backpack."
  
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
// }

// run();