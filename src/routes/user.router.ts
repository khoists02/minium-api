import { Router } from "express";
import { getUsers } from "@src/controllers/user.controller";
import { getAuthenticatedUser, uploadProfile } from "@src/controllers/auth/authenticated.controller";
import { upload } from "@src/middlewares/upload";

const router = Router();

router.get("/users", getUsers);
router.get("/authenticatedUser", getAuthenticatedUser);
// @ts-ignore
router.post("/authenticatedUser/profile", upload.single("profileImage"), uploadProfile);

export default router;