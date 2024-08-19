import express from "express";
import { test, output} from "../contollers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/output",verifyToken, output);

export default router;