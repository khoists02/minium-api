import { Router } from "express";
import { register, login } from "@src/controllers/auth/authentication.controller";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);


export default router;