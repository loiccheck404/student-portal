import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        user: true,
        department: {
          include: {
            faculty: true,
          },
        },
      },
    });

    // Transform data to combine firstName + lastName into name
    const transformedStudents = students.map((student) => ({
      id: student.id,
      matricNumber: student.matricNumber,
      name: `${student.firstName} ${student.lastName}`,
      email: student.user.email,
      phone: student.phone,
      level: student.level,
      department: {
        name: student.department.name,
        code: student.department.code,
        faculty: {
          name: student.department.faculty.name,
        },
      },
    }));

    return NextResponse.json(transformedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
