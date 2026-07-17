import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.js";
import { availabilityRoutes } from "./routes/availability.js";
import { meetingRoutes } from "./routes/meeting.js";
import { adminRoutes } from "./routes/admin.js";
import { userRoutes } from "./routes/user.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://availabilitytrackerfrontend.vercel.app",
  "https://mentorque-theta.vercel.app"
];

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// No-cache on auth routes
app.use("/api/auth", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_, res) => res.json({ ok: true, version: "2.0.0" }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Mentorque backend running on port ${PORT}`);
});