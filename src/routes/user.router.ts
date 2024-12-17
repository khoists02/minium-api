import { Router } from "express";
import { createUsers, getUsers } from "@src/controllers/user.controller";

const router = Router();

router.get("/users", getUsers);
router.post("/users", createUsers);

export default router;