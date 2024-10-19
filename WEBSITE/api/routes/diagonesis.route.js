import express from "express";
import {imgOutput} from "../contollers/diagonesis.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/imageOutput", verifyToken, imgOutput);

export default router;