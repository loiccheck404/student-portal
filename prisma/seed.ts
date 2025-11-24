import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Faculties
  const facultyOfScience = await prisma.faculty.create({
    data: {
      name: "Faculty of Science",
      code: "FS",
      description: "Programs in natural sciences, mathematics, and technology",
    },
  });

  const facultyOfArts = await prisma.faculty.create({
    data: {
      name: "Faculty of Arts",
      code: "FA",
      description: "Programs in humanities and social sciences",
    },
  });

  const facultyOfEconomics = await prisma.faculty.create({
    data: {
      name: "Faculty of Economics and Management Sciences",
      code: "FEMS",
      description: "Programs in business, economics, and management",
    },
  });

  console.log("✅ Faculties created");

  // 2. Create Departments
  const computerEngineering = await prisma.department.create({
    data: {
      name: "Computer Engineering",
      code: "CEN",
      facultyId: facultyOfScience.id,
      description: "Software and hardware engineering programs",
    },
  });

  const biochemistry = await prisma.department.create({
    data: {
      name: "Biochemistry",
      code: "BCH",
      facultyId: facultyOfScience.id,
      description: "Chemical processes in living organisms",
    },
  });

  const mathematics = await prisma.department.create({
    data: {
      name: "Mathematics and Computer Science",
      code: "MCS",
      facultyId: facultyOfScience.id,
      description: "Pure and applied mathematics, computer science",
    },
  });

  const english = await prisma.department.create({
    data: {
      name: "English",
      code: "ENG",
      facultyId: facultyOfArts.id,
      description: "English language and literature",
    },
  });

  const accounting = await prisma.department.create({
    data: {
      name: "Accounting",
      code: "ACC",
      facultyId: facultyOfEconomics.id,
      description: "Financial accounting and auditing",
    },
  });

  const management = await prisma.department.create({
    data: {
      name: "Management and Marketing",
      code: "MGT",
      facultyId: facultyOfEconomics.id,
      description: "Business management and marketing strategies",
    },
  });

  console.log("✅ Departments created");

  // 3. Create Courses for Computer Engineering - Level 200
  await prisma.course.createMany({
    data: [
      // Major Courses
      {
        courseCode: "CEN201",
        courseName: "Data Structures and Algorithms",
        credits: 4,
        courseType: "Major",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description:
          "Introduction to fundamental data structures and algorithm design",
      },
      {
        courseCode: "CEN202",
        courseName: "Object-Oriented Programming",
        credits: 4,
        courseType: "Major",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description: "Advanced programming concepts using Java and C++",
      },
      {
        courseCode: "CEN203",
        courseName: "Computer Architecture",
        credits: 3,
        courseType: "Major",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description: "Hardware design and computer organization",
      },
      // Minor Courses
      {
        courseCode: "MTH201",
        courseName: "Discrete Mathematics",
        credits: 3,
        courseType: "Minor",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Mathematical foundations for computer science",
      },
      {
        courseCode: "MTH202",
        courseName: "Linear Algebra",
        credits: 3,
        courseType: "Minor",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Vectors, matrices, and linear transformations",
      },
      // Elective Courses
      {
        courseCode: "ENG101",
        courseName: "Technical Writing",
        credits: 2,
        courseType: "Elective",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 50,
        totalSpots: 50,
        semester: "Fall 2024",
        description: "Professional and technical communication skills",
      },
      {
        courseCode: "BUS201",
        courseName: "Entrepreneurship Basics",
        credits: 2,
        courseType: "Elective",
        facultyId: facultyOfScience.id,
        departmentId: computerEngineering.id,
        level: "200",
        availableSpots: 45,
        totalSpots: 45,
        semester: "Fall 2024",
        description: "Starting and managing a tech business",
      },
    ],
  });

  // Create courses for Biochemistry - Level 200
  await prisma.course.createMany({
    data: [
      {
        courseCode: "BCH201",
        courseName: "Organic Chemistry",
        credits: 4,
        courseType: "Major",
        facultyId: facultyOfScience.id,
        departmentId: biochemistry.id,
        level: "200",
        availableSpots: 25,
        totalSpots: 25,
        semester: "Fall 2024",
        description: "Chemical compounds and reactions in living systems",
      },
      {
        courseCode: "BCH202",
        courseName: "Cell Biology",
        credits: 4,
        courseType: "Major",
        facultyId: facultyOfScience.id,
        departmentId: biochemistry.id,
        level: "200",
        availableSpots: 25,
        totalSpots: 25,
        semester: "Fall 2024",
        description: "Structure and function of cells",
      },
    ],
  });

  // Create courses for Accounting - Level 200
  await prisma.course.createMany({
    data: [
      {
        courseCode: "ACC201",
        courseName: "Financial Accounting",
        credits: 4,
        courseType: "Major",
        facultyId: facultyOfEconomics.id,
        departmentId: accounting.id,
        level: "200",
        availableSpots: 35,
        totalSpots: 35,
        semester: "Fall 2024",
        description: "Principles of financial accounting and reporting",
      },
      {
        courseCode: "ACC202",
        courseName: "Cost Accounting",
        credits: 3,
        courseType: "Major",
        facultyId: facultyOfEconomics.id,
        departmentId: accounting.id,
        level: "200",
        availableSpots: 35,
        totalSpots: 35,
        semester: "Fall 2024",
        description: "Cost analysis and management",
      },
    ],
  });

  console.log("✅ Courses seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("- 3 Faculties");
  console.log("- 6 Departments");
  console.log("- 11 Courses");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
