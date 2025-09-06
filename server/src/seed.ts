// server/src/seed.ts
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

async function main() {
  const adminEmail = "admin@futurecorp.test";
  const adminPwd = await bcrypt.hash("Admin@123", 10);

  // Upsert Admin
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: adminPwd,
      role: "ADMIN",
    },
  });

  // Sample teacher + students
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@futurecorp.test" },
    update: {},
    create: {
      name: "Teacher One",
      email: "teacher@futurecorp.test",
      password: await bcrypt.hash("Teacher@123", 10),
      role: "TEACHER",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "student1@futurecorp.test" },
    update: {},
    create: {
      name: "Student One",
      email: "student1@futurecorp.test",
      password: await bcrypt.hash("Student@123", 10),
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "student2@futurecorp.test" },
    update: {},
    create: {
      name: "Student Two",
      email: "student2@futurecorp.test",
      password: await bcrypt.hash("Student@123", 10),
      role: "STUDENT",
    },
  });

  // Sample assignment
  await prisma.assignment.create({
    data: {
      title: "Intro to Arrays",
      description: "Solve basic array problems.",
      difficulty: "Easy",
      category: "DSA",
      examples: [{ input: [1,2,3], output: 6 }],
      constraints: [{ time: "O(n)", space: "O(1)" }],
      testCases: [{ in: [2,3,5], out: 10 }],
    } as any,
  });

  // Sample live class
  await prisma.liveClass.create({
    data: { title: "Kickoff Session", schedule: new Date(Date.now() + 86400000) },
  });

  console.log("✅ Seed complete: admin/teacher/students, one assignment, one live class.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});