import express from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/registerUser.controller.js";
import { IsAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/profile', IsAuthenticated , getUserProfile);

export default router;