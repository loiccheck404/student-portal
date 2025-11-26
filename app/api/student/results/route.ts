import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user with grades
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        student: {
          include: {
            grades: {
              include: {
                course: {
                  select: {
                    courseCode: true,
                    courseName: true,
                    credits: true,
                    courseType: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!user || !user.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Calculate GPA
    const grades = user.student.grades;
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade) => {
      totalPoints += grade.gradePoint * grade.course.credits;
      totalCredits += grade.course.credits;
    });

    const gpa =
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    return NextResponse.json({
      grades: user.student.grades,
      gpa,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
