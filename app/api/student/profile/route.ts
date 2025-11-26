import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        student: {
          include: {
            faculty: {
              select: {
                name: true,
                code: true,
              },
            },
            department: {
              select: {
                name: true,
                code: true,
              },
            },
            registrations: true,
          },
        },
      },
    });

    if (!user || !user.student) {
      return NextResponse.json(
        { error: "Student record not found" },
        { status: 404 }
      );
    }

    // Calculate GPA
    const grades = await prisma.grade.findMany({
      where: { studentId: user.student.id },
      include: {
        course: {
          select: { credits: true },
        },
      },
    });

    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade) => {
      totalPoints += grade.gradePoint * grade.course.credits;
      totalCredits += grade.course.credits;
    });

    const gpa =
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    // Return student data with enrolled courses count and GPA
    return NextResponse.json({
      ...user.student,
      enrolledCourses: user.student.registrations.length,
      gpa,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, address } = body;

    // Find the user's student record
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true },
    });

    if (!user || !user.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Update student profile
    const updatedStudent = await prisma.student.update({
      where: { id: user.student.id },
      data: {
        phone: phone || null,
        address: address || null,
      },
      include: {
        faculty: { select: { name: true, code: true } },
        department: { select: { name: true, code: true } },
        registrations: true, // ✅ CHANGED
      },
    });

    return NextResponse.json({
      ...updatedStudent,
      enrolledCourses: updatedStudent.registrations.length, // ✅ CHANGED
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
