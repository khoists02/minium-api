import { Router } from "express";
import { register, login, logout, refreshTokenCall } from "@src/controllers/auth/authentication.controller";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refreshToken", refreshTokenCall);
router.delete("/auth/logout", logout);

export default router;