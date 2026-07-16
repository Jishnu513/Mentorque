import { Router } from "express";
import {
  listUsers,
  listMentors,
  createUser,
  getAvailabilityForUser,
  getOverlappingSlots,
  scheduleMeeting,
  updateMentorMetadata,
  getUserRequirements,
  getRecommendations,
} from "../controllers/adminController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

export const adminRoutes = Router();

adminRoutes.use(authenticate);
adminRoutes.use(requireRole("ADMIN"));

adminRoutes.get("/users", listUsers);
adminRoutes.get("/mentors", listMentors);
adminRoutes.post("/create-user", createUser);
adminRoutes.get("/availability/:userId", getAvailabilityForUser);
adminRoutes.get("/availability/:userId/overlap", getOverlappingSlots);
adminRoutes.post("/meetings", scheduleMeeting);

// New endpoints
adminRoutes.put("/mentors/:id", updateMentorMetadata);
adminRoutes.get("/users/:id/requirements", getUserRequirements);
adminRoutes.post("/recommend", getRecommendations);
