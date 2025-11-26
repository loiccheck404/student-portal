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

  // Find CEN201 course
  const cen201 = await prisma.course.findUnique({
    where: { courseCode: "CEN201" },
  });

  if (!cen201) {
    console.log("CEN201 not found");
    return;
  }

  // Add grade for Peter in CEN201
  const grade = await prisma.grade.create({
    data: {
      studentId: peter.id,
      courseId: cen201.id,
      score: 85.5,
      letterGrade: "A",
      gradePoint: 4.0,
      semester: "Fall 2024",
      academicYear: "2024/2025",
      remarks: "Excellent",
    },
  });

  console.log("✅ Grade added:", grade);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
