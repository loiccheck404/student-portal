import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find Peter's student record
  const peter = await prisma.student.findUnique({
    where: { matricNumber: "ST2024001" },
  });

  if (!peter) {
    console.log("Peter not found");
    return;
  }

  // Find courses
  const courses = await prisma.course.findMany({
    where: {
      courseCode: {
        in: ["CEN202", "CEN203", "MTH201", "MTH202"],
      },
    },
  });

  const courseMap = new Map(courses.map((c) => [c.courseCode, c]));

  // Add multiple grades for different semesters
  const gradesToAdd = [
    {
      courseCode: "CEN202",
      score: 78.0,
      letterGrade: "B+",
      gradePoint: 3.5,
      semester: "Fall 2024",
      academicYear: "2024/2025",
      remarks: "Very Good",
    },
    {
      courseCode: "CEN203",
      score: 92.0,
      letterGrade: "A",
      gradePoint: 4.0,
      semester: "Fall 2024",
      academicYear: "2024/2025",
      remarks: "Excellent",
    },
    {
      courseCode: "MTH201",
      score: 65.0,
      letterGrade: "C",
      gradePoint: 2.0,
      semester: "Spring 2025",
      academicYear: "2024/2025",
      remarks: "Pass",
    },
    {
      courseCode: "MTH202",
      score: 88.5,
      letterGrade: "A",
      gradePoint: 4.0,
      semester: "Spring 2025",
      academicYear: "2024/2025",
      remarks: "Excellent",
    },
  ];

  for (const gradeData of gradesToAdd) {
    const course = courseMap.get(gradeData.courseCode);
    if (course) {
      try {
        const grade = await prisma.grade.create({
          data: {
            studentId: peter.id,
            courseId: course.id,
            score: gradeData.score,
            letterGrade: gradeData.letterGrade,
            gradePoint: gradeData.gradePoint,
            semester: gradeData.semester,
            academicYear: gradeData.academicYear,
            remarks: gradeData.remarks,
          },
        });
        console.log(`✅ Added grade for ${gradeData.courseCode}`);
      } catch (error) {
        console.log(`⚠️  Grade for ${gradeData.courseCode} may already exist`);
      }
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
