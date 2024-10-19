import express from "express";
import { test, output, readToken, updateUser} from "../contollers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/output",verifyToken, output);
router.get("/readToken", verifyToken, readToken);
router.post("/update/:userId", verifyToken, updateUser);
export default router;