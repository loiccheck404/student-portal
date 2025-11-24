import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({
      include: {
        departments: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ faculties });
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculties" },
      { status: 500 }
    );
  }
}
