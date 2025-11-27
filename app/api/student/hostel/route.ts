import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch student's hostel application
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        student: {
          include: {
            hostelApplication: {
              include: {
                dorm: true,
                room: true,
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!user?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      application: user.student.hostelApplication,
    });
  } catch (error) {
    console.error("Error fetching hostel application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// POST - Create hostel application
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        student: {
          include: {
            hostelApplication: true,
          },
        },
      },
    });

    if (!user?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if application already exists
    if (user.student.hostelApplication) {
      return NextResponse.json(
        { error: "You already have a hostel application" },
        { status: 400 }
      );
    }

    // Create hostel application
    const application = await prisma.hostelApplication.create({
      data: {
        studentId: user.student.id,
        status: "Pending",
      },
      include: {
        dorm: true,
        room: true,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        studentId: user.student.id,
        title: "Hostel Application Submitted",
        message:
          "Your hostel application has been submitted successfully. Waiting for dorm assignment.",
        type: "hostel",
        link: "/dashboard/hostel",
      },
    });

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error creating hostel application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
