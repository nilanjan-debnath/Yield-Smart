import express from "express";
import { test } from "../contollers/user.controller.js";

const router = express.Router();

router.get("/test", test);

export default router;