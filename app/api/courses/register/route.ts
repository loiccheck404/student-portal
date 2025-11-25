// app/api/courses/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get student
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true },
    });

    if (!user?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if already registered
    const existingRegistration = await prisma.courseRegistration.findFirst({
      where: {
        studentId: user.student.id,
        courseId: courseId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this course" },
        { status: 400 }
      );
    }

    // Check if course exists and has available spots
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.availableSpots <= 0) {
      return NextResponse.json(
        { error: "No available spots" },
        { status: 400 }
      );
    }

    // Register for course and decrease available spots
    await prisma.$transaction([
      prisma.courseRegistration.create({
        data: {
          studentId: user.student.id,
          courseId: courseId,
        },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: {
          availableSpots: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({ message: "Successfully registered" });
  } catch (error) {
    console.error("Error registering for course:", error);
    return NextResponse.json(
      { error: "Failed to register for course" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get student
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true },
    });

    if (!user?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Find registration
    const registration = await prisma.courseRegistration.findFirst({
      where: {
        studentId: user.student.id,
        courseId: courseId,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Not registered for this course" },
        { status: 404 }
      );
    }

    // Unregister and increase available spots
    await prisma.$transaction([
      prisma.courseRegistration.delete({
        where: { id: registration.id },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: {
          availableSpots: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({ message: "Successfully unregistered" });
  } catch (error) {
    console.error("Error unregistering from course:", error);
    return NextResponse.json(
      { error: "Failed to unregister from course" },
      { status: 500 }
    );
  }
}
