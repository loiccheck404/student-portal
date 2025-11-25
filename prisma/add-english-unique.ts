// prisma/add-english-unique.ts
// Run this with: npx ts-node prisma/add-english-unique.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adding English department courses...");

  // Get the English department
  const english = await prisma.department.findFirst({
    where: { code: "ENG" },
    include: { faculty: true },
  });

  if (!english) {
    console.error("❌ English department not found!");
    console.log("\n💡 Marie's department info:");

    // Find Marie's actual department
    const marie = await prisma.student.findFirst({
      where: { firstName: "Marie" },
      include: { department: { include: { faculty: true } } },
    });

    if (marie) {
      console.log(`   Department: ${marie.department.name}`);
      console.log(`   Code: ${marie.department.code}`);
      console.log(`   Faculty: ${marie.department.faculty.name}`);

      console.log("\n✅ Using Marie's actual department...");

      // Use Marie's department
      const courses = await prisma.course.createMany({
        data: [
          // Major Courses - UNIQUE CODES
          {
            courseCode: "ELIT101",
            courseName: "Introduction to English Literature",
            credits: 3,
            courseType: "Major",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 35,
            totalSpots: 35,
            semester: "Fall 2024",
            description: "Survey of major literary works and genres",
          },
          {
            courseCode: "ECOM102",
            courseName: "English Composition",
            credits: 3,
            courseType: "Major",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 35,
            totalSpots: 35,
            semester: "Fall 2024",
            description: "Academic writing and research skills",
          },
          {
            courseCode: "EPOE103",
            courseName: "Introduction to Poetry",
            credits: 3,
            courseType: "Major",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 30,
            totalSpots: 30,
            semester: "Fall 2024",
            description: "Analysis and interpretation of poetry",
          },
          // Minor Courses - UNIQUE CODES
          {
            courseCode: "LING101",
            courseName: "Introduction to Linguistics",
            credits: 3,
            courseType: "Minor",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 40,
            totalSpots: 40,
            semester: "Fall 2024",
            description: "Basic concepts of language structure",
          },
          {
            courseCode: "SPCH101",
            courseName: "Public Speaking",
            credits: 2,
            courseType: "Minor",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 40,
            totalSpots: 40,
            semester: "Fall 2024",
            description: "Fundamentals of oral communication",
          },
          // Elective Courses - UNIQUE CODES
          {
            courseCode: "DRAM101",
            courseName: "Introduction to Drama",
            credits: 2,
            courseType: "Elective",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 45,
            totalSpots: 45,
            semester: "Fall 2024",
            description: "Study of dramatic literature and performance",
          },
          {
            courseCode: "CRWR101",
            courseName: "Creative Writing I",
            credits: 2,
            courseType: "Elective",
            facultyId: marie.department.facultyId,
            departmentId: marie.department.id,
            level: "100",
            availableSpots: 25,
            totalSpots: 25,
            semester: "Fall 2024",
            description: "Introduction to fiction and poetry writing",
          },
        ],
      });

      console.log("\n✅ Courses added successfully!");
      console.log("\n📊 Summary:");
      console.log("- Major courses: 3");
      console.log("- Minor courses: 2");
      console.log("- Elective courses: 2");
      console.log(`- Total: ${courses.count} new Level 100 courses`);
      console.log("\n🎓 Marie can now see these courses!");
    } else {
      console.error("❌ Marie not found!");
    }
    return;
  }

  // If English dept exists, use it
  const courses = await prisma.course.createMany({
    data: [
      {
        courseCode: "ELIT101",
        courseName: "Introduction to English Literature",
        credits: 3,
        courseType: "Major",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 35,
        totalSpots: 35,
        semester: "Fall 2024",
        description: "Survey of major literary works and genres",
      },
      {
        courseCode: "ECOM102",
        courseName: "English Composition",
        credits: 3,
        courseType: "Major",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 35,
        totalSpots: 35,
        semester: "Fall 2024",
        description: "Academic writing and research skills",
      },
      {
        courseCode: "EPOE103",
        courseName: "Introduction to Poetry",
        credits: 3,
        courseType: "Major",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description: "Analysis and interpretation of poetry",
      },
      {
        courseCode: "LING101",
        courseName: "Introduction to Linguistics",
        credits: 3,
        courseType: "Minor",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Basic concepts of language structure",
      },
      {
        courseCode: "SPCH101",
        courseName: "Public Speaking",
        credits: 2,
        courseType: "Minor",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Fundamentals of oral communication",
      },
      {
        courseCode: "DRAM101",
        courseName: "Introduction to Drama",
        credits: 2,
        courseType: "Elective",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 45,
        totalSpots: 45,
        semester: "Fall 2024",
        description: "Study of dramatic literature and performance",
      },
      {
        courseCode: "CRWR101",
        courseName: "Creative Writing I",
        credits: 2,
        courseType: "Elective",
        facultyId: english.facultyId,
        departmentId: english.id,
        level: "100",
        availableSpots: 25,
        totalSpots: 25,
        semester: "Fall 2024",
        description: "Introduction to fiction and poetry writing",
      },
    ],
  });

  console.log("\n✅ Courses added successfully!");
  console.log("\n📊 Summary:");
  console.log("- Major courses: 3");
  console.log("- Minor courses: 2");
  console.log("- Elective courses: 2");
  console.log(`- Total: ${courses.count} new courses`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
