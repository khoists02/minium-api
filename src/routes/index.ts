import { Router } from "express";
import { getUsers } from "@src/controllers/user.controller";

const router = Router();

router.get("/users", getUsers);

export default router;