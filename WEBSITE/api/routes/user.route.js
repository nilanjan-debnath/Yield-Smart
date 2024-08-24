import express from "express";
import { test, output, readToken} from "../contollers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/output",verifyToken, output);
router.get("/readToken", verifyToken, readToken);

export default router;