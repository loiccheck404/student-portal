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

    const { studentFeeId, amount, paymentMethod } = await request.json();

    if (!studentFeeId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true },
    });

    if (!user?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get the student fee
    const studentFee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
    });

    if (!studentFee) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    if (studentFee.studentId !== user.student.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (amount > studentFee.balance) {
      return NextResponse.json(
        { error: "Amount exceeds balance" },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        studentId: user.student.id,
        studentFeeId: studentFeeId,
        amount: amount,
        paymentMethod: paymentMethod,
        transactionId: `TXN${Date.now()}${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        status: "Completed",
      },
    });

    // Update student fee
    const newPaidAmount = studentFee.paidAmount + amount;
    const newBalance = studentFee.balance - amount;
    const newStatus =
      newBalance === 0
        ? "Paid"
        : newBalance < studentFee.totalAmount
        ? "Partial"
        : "Unpaid";

    await prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newStatus,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        studentId: user.student.id,
        title: "Payment Successful",
        message: `Payment of ${amount.toLocaleString()} FCFA via ${paymentMethod} was successful`,
        type: "payment",
        link: "/dashboard/payments",
      },
    });

    return NextResponse.json({
      message: "Payment successful",
      payment,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
