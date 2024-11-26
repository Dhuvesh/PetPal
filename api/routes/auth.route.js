import express, { Router } from "express";
import { google, signup } from "../controllers/auth.controller.js";
import { signIn } from "../controllers/auth.controller.js";

const router = express.Router();

 router.post('/signup', signup);
 router.post("/signin", signIn);
 router.post("/google", google)
 

 export default router