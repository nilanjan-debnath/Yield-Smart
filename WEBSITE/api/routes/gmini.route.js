import express from "express";
import { getInfo } from "../contollers/gemini.controller.js";

const router = express.Router();

router.post("/getInfo", getInfo);

export default router;