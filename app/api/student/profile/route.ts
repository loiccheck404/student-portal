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

    // Return student data with faculty and department
    return NextResponse.json(user.student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ADD THIS ENTIRE PUT FUNCTION AFTER THE GET FUNCTION:
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
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
