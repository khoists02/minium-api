import { Router } from "express";
import { register, login, logout, refreshToken } from "@src/controllers/auth/authentication.controller";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refreshToken", refreshToken);
router.delete("/auth/logout", logout);

export default router;