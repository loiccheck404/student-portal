import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dorms = await prisma.dorm.findMany({
      include: {
        rooms: {
          orderBy: {
            roomNumber: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ dorms });
  } catch (error) {
    console.error("Error fetching dorms:", error);
    return NextResponse.json(
      { error: "Failed to fetch dorms" },
      { status: 500 },
    );
  }
}
