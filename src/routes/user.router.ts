import { Router } from "express";
import { getUsers } from "@src/controllers/user.controller";
import { getAuthenticatedUser } from "@src/controllers/auth/authenticated.controller";

const router = Router();

router.get("/users", getUsers);
router.get("/authenticatedUser", getAuthenticatedUser);

export default router;