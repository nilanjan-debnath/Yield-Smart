import express from "express";
import { test, output, imgOutput } from "../contollers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/output",verifyToken, output);
router.post("/imageOuput", verifyToken, imgOutput);

export default router;