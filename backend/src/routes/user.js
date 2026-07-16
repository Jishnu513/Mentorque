import { Router } from "express";
import { updateRequirements, getProfile } from "../controllers/userController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

export const userRoutes = Router();

userRoutes.use(authenticate);

userRoutes.get("/profile", getProfile);
userRoutes.put("/requirements", requireRole("USER"), updateRequirements);
