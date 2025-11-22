import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      matricNumber,
      dateOfBirth,
      department,
      level,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "student",
        student: {
          create: {
            matricNumber,
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            department,
            level,
            enrollmentYear: new Date().getFullYear(),
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
