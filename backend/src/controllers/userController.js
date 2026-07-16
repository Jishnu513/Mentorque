import { prisma } from "../lib/prisma.js";

const ALLOWED_USER_TAGS = [
  "Tech",
  "Non-tech",
  "Good Communication",
  "Asks a lot of questions",
];

const ALLOWED_CALL_TYPES = ["RESUME_REVAMP", "JOB_MARKET_GUIDANCE", "MOCK_INTERVIEW"];

export async function updateRequirements(req, res, next) {
  try {
    const userId = req.userId;
    const { callType, description, tags } = req.body;

    if (callType && !ALLOWED_CALL_TYPES.includes(callType)) {
      return res.status(400).json({ error: "Invalid callType" });
    }

    const filteredTags = Array.isArray(tags)
      ? tags.filter((t) => ALLOWED_USER_TAGS.includes(t))
      : undefined;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(callType !== undefined && { callType: callType || null }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(filteredTags !== undefined && { tags: filteredTags }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tags: true,
        description: true,
        callType: true,
      },
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        timezone: true,
        tags: true,
        description: true,
        callType: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    next(e);
  }
}
