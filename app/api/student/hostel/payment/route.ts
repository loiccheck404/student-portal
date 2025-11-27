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

    const { amount, paymentMethod } = await request.json();

    if (!amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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

    if (!user.student.hostelApplication) {
      return NextResponse.json(
        { error: "No hostel application found" },
        { status: 404 }
      );
    }

    const hostelApp = user.student.hostelApplication;
    const balance = hostelApp.feeAmount - hostelApp.paidAmount;

    if (amount > balance) {
      return NextResponse.json(
        { error: "Amount exceeds balance" },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        studentId: user.student.id,
        hostelAppId: hostelApp.id,
        amount: amount,
        paymentMethod: paymentMethod,
        transactionId: `TXN${Date.now()}${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        status: "Completed",
      },
    });

    // Update hostel application
    const newPaidAmount = hostelApp.paidAmount + amount;
    const newStatus = newPaidAmount >= hostelApp.feeAmount ? "Paid" : "Pending";

    await prisma.hostelApplication.update({
      where: { id: hostelApp.id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        studentId: user.student.id,
        title: "Hostel Payment Successful",
        message: `Payment of ${amount.toLocaleString()} FCFA via ${paymentMethod} was successful`,
        type: "payment",
        link: "/dashboard/hostel",
      },
    });

    return NextResponse.json({
      message: "Payment successful",
      payment,
    });
  } catch (error) {
    console.error("Hostel payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
