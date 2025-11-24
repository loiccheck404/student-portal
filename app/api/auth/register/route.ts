import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      matricNumber,
      dateOfBirth,
      phone,
      address,
      facultyId,
      departmentId,
      level,
      enrollmentYear,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Check if matric number already exists
    const existingMatric = await prisma.student.findUnique({
      where: { matricNumber },
    });

    if (existingMatric) {
      return NextResponse.json(
        { error: "Matric number already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and student in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "student",
        },
      });

      // Create student profile
      const student = await tx.student.create({
        data: {
          userId: user.id,
          matricNumber,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          phone: phone || null,
          address: address || null,
          facultyId,
          departmentId,
          level,
          enrollmentYear: parseInt(enrollmentYear),
        },
      });

      return { user, student };
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
