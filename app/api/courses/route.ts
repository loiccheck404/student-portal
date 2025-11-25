// app/api/courses/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        student: {
          include: {
            department: true,
            registrations: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!user?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get available courses for student's level and department
    const courses = await prisma.course.findMany({
      where: {
        departmentId: user.student.departmentId,
        level: user.student.level,
      },
      include: {
        department: true,
        faculty: true,
      },
      orderBy: [
        { courseType: "asc" }, // Major, Minor, Elective
        { courseCode: "asc" },
      ],
    });

    // Get registered course IDs
    const registeredCourseIds = user.student.registrations.map(
      (reg) => reg.courseId
    );

    // Add isRegistered flag to each course
    const coursesWithStatus = courses.map((course) => ({
      ...course,
      isRegistered: registeredCourseIds.includes(course.id),
    }));

    return NextResponse.json({
      courses: coursesWithStatus,
      student: user.student,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
