import { Router } from "express";
import { createUsers, getUsers } from "@src/controllers/user.controller";
import { getAuthenticatedUser } from "@src/controllers/auth/authenticated.controller";

const router = Router();

router.get("/users", getUsers);
router.post("/users", createUsers);
router.get("/authenticatedUser", getAuthenticatedUser);

export default router;