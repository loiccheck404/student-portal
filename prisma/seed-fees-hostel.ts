import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for fees and hostel...");

  // 1. Create Fee Types
  const feeTypes = await Promise.all([
    prisma.feeType.create({
      data: {
        name: "Tuition Fee",
        amount: 200000, // 200,000 FCFA
        description: "Semester tuition fee",
        semester: "Fall 2024",
      },
    }),
    prisma.feeType.create({
      data: {
        name: "Registration Fee",
        amount: 25000, // 25,000 FCFA
        description: "Course registration fee",
        semester: "Fall 2024",
      },
    }),
    prisma.feeType.create({
      data: {
        name: "Library Fee",
        amount: 15000, // 15,000 FCFA
        description: "Library access fee",
        semester: "Fall 2024",
      },
    }),
  ]);
  console.log("✅ Created 3 fee types");

  // 2. Assign fees to all students
  const students = await prisma.student.findMany();

  for (const student of students) {
    for (const feeType of feeTypes) {
      await prisma.studentFee.create({
        data: {
          studentId: student.id,
          feeTypeId: feeType.id,
          totalAmount: feeType.amount,
          balance: feeType.amount,
          status: "Unpaid",
        },
      });
    }
  }
  console.log(`✅ Assigned fees to ${students.length} students`);

  // 3. Create Dorms
  const dorms = await Promise.all([
    prisma.dorm.create({
      data: {
        name: "Block A",
        description: "Male hostel block",
        totalRooms: 20,
      },
    }),
    prisma.dorm.create({
      data: {
        name: "Block B",
        description: "Female hostel block",
        totalRooms: 20,
      },
    }),
    prisma.dorm.create({
      data: {
        name: "Block C",
        description: "Mixed hostel block",
        totalRooms: 20,
      },
    }),
  ]);
  console.log("✅ Created 3 dorms");

  // 4. Create Rooms for each dorm
  for (const dorm of dorms) {
    const rooms = [];
    for (let i = 1; i <= dorm.totalRooms; i++) {
      rooms.push({
        dormId: dorm.id,
        roomNumber: i.toString().padStart(3, "0"), // "001", "002", etc.
      });
    }
    await prisma.room.createMany({ data: rooms });
  }
  console.log("✅ Created 60 rooms (20 per dorm)");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
