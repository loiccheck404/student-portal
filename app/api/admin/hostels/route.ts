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

    // Get all hostel applications with student and assignment details
    const applications = await prisma.hostelApplication.findMany({
      include: {
        student: {
          include: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        dorm: true,
        room: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching hostel applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
