import express from "express";
import { signUp, signIn, logout } from "../contollers/auto.controller.js";


const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/logout", logout);

export default router;