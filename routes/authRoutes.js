import express from "express";
import { login, logout, register, secret } from "../controllers/AuthController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/secret', secret);

export default router;