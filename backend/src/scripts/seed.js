/**
 * Seed script for Mentorque Mentoring Call Scheduling System
 * Creates: 10 Users, 5 Mentors, 1 Admin
 * Run: node src/scripts/seed.js
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const HASH_ROUNDS = 12;

const users = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech", "Asks a lot of questions"],
    description: "Frontend developer with 2 years of experience. Looking for resume review to target FAANG companies.",
    callType: "RESUME_REVAMP",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Non-tech"],
    description: "MBA graduate pivoting to product management in the tech industry. Need career path guidance.",
    callType: "JOB_MARKET_GUIDANCE",
  },
  {
    name: "Chloe Davis",
    email: "chloe@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech"],
    description: "Python developer preparing for data science and ML engineering interview rounds.",
    callType: "MOCK_INTERVIEW",
  },
  {
    name: "David Kim",
    email: "david@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech"],
    description: "Backend developer with 3 years at a startup. Looking to make the move to a Big Tech company.",
    callType: "RESUME_REVAMP",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Non-tech", "Asks a lot of questions"],
    description: "Recent business graduate unsure about career direction. Want to understand options in tech adjacent roles.",
    callType: "JOB_MARKET_GUIDANCE",
  },
  {
    name: "Frank Lee",
    email: "frank@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech"],
    description: "Frontend developer with 4 years experience, preparing for senior software engineer interviews.",
    callType: "MOCK_INTERVIEW",
  },
  {
    name: "Grace Chen",
    email: "grace@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech"],
    description: "ML engineer looking to transition to a research scientist role at a top AI lab.",
    callType: "RESUME_REVAMP",
  },
  {
    name: "Harry Brown",
    email: "harry@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Non-tech"],
    description: "Sales manager at a mid-size company wanting to explore transition into tech sales or account management.",
    callType: "JOB_MARKET_GUIDANCE",
  },
  {
    name: "Isla Martin",
    email: "isla@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech"],
    description: "DevOps engineer preparing for senior platform engineering interviews at cloud companies.",
    callType: "MOCK_INTERVIEW",
  },
  {
    name: "Jack Taylor",
    email: "jack@example.com",
    password: "Pass@1234",
    role: "USER",
    tags: ["Tech", "Asks a lot of questions"],
    description: "Full-stack developer targeting senior engineer roles at FAANG. Resume needs big tech polish.",
    callType: "RESUME_REVAMP",
  },
];

const mentors = [
  {
    name: "Dr. Priya Nair",
    email: "priya@mentor.com",
    password: "Pass@1234",
    role: "MENTOR",
    tags: ["Tech", "Big Company", "India", "Senior Developer", "Good Communication"],
    description:
      "10 years at Google India as a Staff Software Engineer. Expert in system design, backend at scale, and FAANG interview preparation. Helped 50+ engineers land roles at top companies.",
  },
  {
    name: "James O'Brien",
    email: "james@mentor.com",
    password: "Pass@1234",
    role: "MENTOR",
    tags: ["Tech", "Big Company", "Ireland", "Senior Developer"],
    description:
      "Staff Engineer at Meta Dublin with prior experience at Amazon and Microsoft. Excellent at resume reviews for Big Tech roles and technical mock interviews for senior positions.",
  },
  {
    name: "Sunita Rao",
    email: "sunita@mentor.com",
    password: "Pass@1234",
    role: "MENTOR",
    tags: ["Non-tech", "Public Company", "India", "Good Communication"],
    description:
      "Senior Product Manager at Infosys with an MBA from IIM Bangalore. 8 years of experience across product, strategy, and market analysis. Great at career guidance and pivots.",
  },
  {
    name: "Carlos Mendez",
    email: "carlos@mentor.com",
    password: "Pass@1234",
    role: "MENTOR",
    tags: ["Tech", "Public Company", "Good Communication"],
    description:
      "Senior Software Developer at TCS with 7 years of experience. Known for exceptional communication and breaking down complex concepts. Specializes in technical mock interviews.",
  },
  {
    name: "Aisling Murphy",
    email: "aisling@mentor.com",
    password: "Pass@1234",
    role: "MENTOR",
    tags: ["Non-tech", "Ireland", "Good Communication", "Senior Developer"],
    description:
      "HR Director at a Dublin-based fintech company. Expert in job market trends, interview coaching for non-technical roles, and career pivots in the Irish and European job market.",
  },
];

const admin = {
  name: "Admin User",
  email: "admin@mentorque.com",
  password: "Admin@1234",
  role: "ADMIN",
  tags: [],
  description: "Platform administrator",
};

async function seed() {
  console.log("🌱 Starting Mentorque seed...\n");

  // Clear existing data (order matters due to FK constraints)
  console.log("🧹 Clearing existing data...");
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.availabilityException.deleteMany();
  await prisma.availabilityWeekMeta.deleteMany();
  await prisma.availabilityTemplate.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleared\n");

  // Create admin
  console.log("👑 Creating admin...");
  const adminHash = await bcrypt.hash(admin.password, HASH_ROUNDS);
  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: admin.name,
      email: admin.email,
      password: adminHash,
      role: admin.role,
      tags: admin.tags,
      description: admin.description,
    },
  });
  console.log(`  ✓ ${admin.name} (${admin.email})`);

  // Create mentors
  console.log("\n🎓 Creating mentors...");
  for (const m of mentors) {
    const hash = await bcrypt.hash(m.password, HASH_ROUNDS);
    await prisma.user.create({
      data: {
        id: uuidv4(),
        name: m.name,
        email: m.email,
        password: hash,
        role: m.role,
        tags: m.tags,
        description: m.description,
      },
    });
    console.log(`  ✓ ${m.name} (${m.email}) | Tags: ${m.tags.join(", ")}`);
  }

  // Create users
  console.log("\n👥 Creating users...");
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, HASH_ROUNDS);
    await prisma.user.create({
      data: {
        id: uuidv4(),
        name: u.name,
        email: u.email,
        password: hash,
        role: u.role,
        tags: u.tags,
        description: u.description,
        callType: u.callType,
      },
    });
    console.log(`  ✓ ${u.name} (${u.email}) | Call Type: ${u.callType}`);
  }

  console.log("\n✅ Seed complete!\n");
  console.log("━".repeat(60));
  console.log("DEMO CREDENTIALS");
  console.log("━".repeat(60));
  console.log(`👑 Admin:  admin@mentorque.com  /  Admin@1234`);
  console.log(`🎓 Mentor: priya@mentor.com     /  Pass@1234`);
  console.log(`👤 User:   alice@example.com    /  Pass@1234`);
  console.log("━".repeat(60));
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
