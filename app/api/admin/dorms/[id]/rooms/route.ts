import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, dormId, roomId } = await request.json();

    if (!applicationId || !dormId || !roomId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if room is already occupied
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.isOccupied) {
      return NextResponse.json(
        { error: "Room is already occupied" },
        { status: 400 }
      );
    }

    // Update hostel application and mark room as occupied
    await prisma.$transaction([
      prisma.hostelApplication.update({
        where: { id: applicationId },
        data: {
          dormId: dormId,
          roomId: roomId,
        },
      }),
      prisma.room.update({
        where: { id: roomId },
        data: {
          isOccupied: true,
        },
      }),
    ]);

    // Get student ID for notification
    const application = await prisma.hostelApplication.findUnique({
      where: { id: applicationId },
      include: { dorm: true, room: true },
    });

    if (application) {
      // Create notification for student
      await prisma.notification.create({
        data: {
          studentId: application.studentId,
          title: "Hostel Room Assigned",
          message: `You have been assigned to ${application.dorm?.name}, Room ${application.room?.roomNumber}. Please proceed to make payment.`,
          type: "hostel",
          link: "/dashboard/hostel",
        },
      });
    }

    return NextResponse.json({
      message: "Dorm and room assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning dorm:", error);
    return NextResponse.json(
      { error: "Failed to assign dorm" },
      { status: 500 }
    );
  }
}
