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

    const [
      totalStudents,
      pendingHostelApplications,
      totalPayments,
      totalDorms,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.hostelApplication.count({
        where: { status: "pending" },
      }),
      prisma.payment.count(),
      prisma.dorm.count(),
    ]);

    return NextResponse.json({
      totalStudents,
      pendingHostelApplications,
      totalPayments,
      totalDorms,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
