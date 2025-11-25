// prisma/add-level-100-courses.ts
// Run this with: npx ts-node prisma/add-level-100-courses.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adding Level 100 courses...");

  // Get the departments
  const computerEngineering = await prisma.department.findFirst({
    where: { code: "CEN" },
    include: { faculty: true },
  });

  const biochemistry = await prisma.department.findFirst({
    where: { code: "BCH" },
    include: { faculty: true },
  });

  const accounting = await prisma.department.findFirst({
    where: { code: "ACC" },
    include: { faculty: true },
  });

  if (!computerEngineering || !biochemistry || !accounting) {
    console.error("❌ Departments not found!");
    return;
  }

  // Add Level 100 courses for Computer Engineering
  await prisma.course.createMany({
    data: [
      // Major Courses
      {
        courseCode: "CEN101",
        courseName: "Introduction to Computing",
        credits: 3,
        courseType: "Major",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Basic concepts of computing and programming fundamentals",
      },
      {
        courseCode: "CEN102",
        courseName: "Computer Programming I",
        credits: 4,
        courseType: "Major",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Introduction to programming using Python",
      },
      {
        courseCode: "CEN103",
        courseName: "Digital Logic Design",
        credits: 3,
        courseType: "Major",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Boolean algebra and digital circuit design",
      },
      // Minor Courses
      {
        courseCode: "MTH101",
        courseName: "Calculus I",
        credits: 3,
        courseType: "Minor",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 50,
        totalSpots: 50,
        semester: "Fall 2024",
        description: "Differential and integral calculus",
      },
      {
        courseCode: "PHY101",
        courseName: "Physics I",
        credits: 3,
        courseType: "Minor",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 50,
        totalSpots: 50,
        semester: "Fall 2024",
        description: "Mechanics and thermodynamics",
      },
      // Elective Courses
      {
        courseCode: "ENG100",
        courseName: "English Communication Skills",
        credits: 2,
        courseType: "Elective",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 60,
        totalSpots: 60,
        semester: "Fall 2024",
        description: "Basic English writing and speaking skills",
      },
      {
        courseCode: "GEN101",
        courseName: "Introduction to University Studies",
        credits: 2,
        courseType: "Elective",
        facultyId: computerEngineering.facultyId,
        departmentId: computerEngineering.id,
        level: "100",
        availableSpots: 60,
        totalSpots: 60,
        semester: "Fall 2024",
        description: "Orientation to university life and academic success",
      },
    ],
  });

  // Add Level 100 courses for Biochemistry
  await prisma.course.createMany({
    data: [
      {
        courseCode: "BCH101",
        courseName: "General Chemistry I",
        credits: 4,
        courseType: "Major",
        facultyId: biochemistry.facultyId,
        departmentId: biochemistry.id,
        level: "100",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description: "Introduction to chemical principles",
      },
      {
        courseCode: "BCH102",
        courseName: "General Biology I",
        credits: 4,
        courseType: "Major",
        facultyId: biochemistry.facultyId,
        departmentId: biochemistry.id,
        level: "100",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description: "Fundamental concepts in biology",
      },
    ],
  });

  // Add Level 100 courses for Accounting
  await prisma.course.createMany({
    data: [
      {
        courseCode: "ACC101",
        courseName: "Introduction to Accounting",
        credits: 3,
        courseType: "Major",
        facultyId: accounting.facultyId,
        departmentId: accounting.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Basic accounting principles and practices",
      },
      {
        courseCode: "ACC102",
        courseName: "Business Mathematics",
        credits: 3,
        courseType: "Major",
        facultyId: accounting.facultyId,
        departmentId: accounting.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Mathematical concepts for business applications",
      },
    ],
  });

  console.log("✅ Level 100 courses added successfully!");
  console.log("\n📊 Summary:");
  console.log("- Computer Engineering: 7 courses");
  console.log("- Biochemistry: 2 courses");
  console.log("- Accounting: 2 courses");
  console.log("- Total: 11 new Level 100 courses");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
