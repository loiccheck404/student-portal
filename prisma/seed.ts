import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding courses...");

  // Major Courses
  await prisma.course.createMany({
    data: [
      {
        courseCode: "CSC201",
        courseName: "Data Structures and Algorithms",
        credits: 4,
        courseType: "Major",
        availableSpots: 30,
        totalSpots: 30,
        semester: "Fall 2024",
        description: "Introduction to data structures and algorithm design",
      },
      {
        courseCode: "CSC301",
        courseName: "Database Management Systems",
        credits: 3,
        courseType: "Major",
        availableSpots: 25,
        totalSpots: 25,
        semester: "Fall 2024",
        description: "Design and implementation of database systems",
      },
      {
        courseCode: "CSC401",
        courseName: "Software Engineering",
        credits: 4,
        courseType: "Major",
        availableSpots: 20,
        totalSpots: 20,
        semester: "Fall 2024",
        description: "Principles and practices of software development",
      },
    ],
  });

  // Minor Courses
  await prisma.course.createMany({
    data: [
      {
        courseCode: "MTH201",
        courseName: "Discrete Mathematics",
        credits: 3,
        courseType: "Minor",
        availableSpots: 40,
        totalSpots: 40,
        semester: "Fall 2024",
        description: "Mathematical foundations for computer science",
      },
      {
        courseCode: "MTH301",
        courseName: "Linear Algebra",
        credits: 3,
        courseType: "Minor",
        availableSpots: 35,
        totalSpots: 35,
        semester: "Fall 2024",
        description: "Vectors, matrices, and linear transformations",
      },
    ],
  });

  // Elective Courses
  await prisma.course.createMany({
    data: [
      {
        courseCode: "ENG101",
        courseName: "Technical Writing",
        credits: 2,
        courseType: "Elective",
        availableSpots: 50,
        totalSpots: 50,
        semester: "Fall 2024",
        description: "Professional and technical communication skills",
      },
      {
        courseCode: "BUS201",
        courseName: "Entrepreneurship",
        credits: 2,
        courseType: "Elective",
        availableSpots: 45,
        totalSpots: 45,
        semester: "Fall 2024",
        description: "Starting and managing a business",
      },
      {
        courseCode: "PSY101",
        courseName: "Introduction to Psychology",
        credits: 2,
        courseType: "Elective",
        availableSpots: 60,
        totalSpots: 60,
        semester: "Fall 2024",
        description: "Basic principles of human behavior",
      },
    ],
  });

  console.log("✅ Courses seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
