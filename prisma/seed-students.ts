import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("�� Creating students...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Get departments
  const computerEng = await prisma.department.findFirst({ where: { code: "CEN" } });
  const english = await prisma.department.findFirst({ where: { code: "ENG" } });
  const biochem = await prisma.department.findFirst({ where: { code: "BCH" } });
  const accounting = await prisma.department.findFirst({ where: { code: "ACC" } });

  if (!computerEng || !english || !biochem || !accounting) {
    console.log("❌ Departments not found!");
    return;
  }

  // Create User + Student pairs
  const students = [
    {
      email: "peter@student.cm",
      matricNumber: "ST2024001",
      firstName: "Peter",
      lastName: "Tanko",
      level: "200",
      facultyId: computerEng.facultyId,
      departmentId: computerEng.id,
      phone: "+237670000001",
      dateOfBirth: new Date("2004-05-15"),
      enrollmentYear: 2023,
    },
    {
      email: "marie@student.cm",
      matricNumber: "ST2024002",
      firstName: "Marie",
      lastName: "Nkengasong",
      level: "100",
      facultyId: english.facultyId,
      departmentId: english.id,
      phone: "+237670000002",
      dateOfBirth: new Date("2005-08-22"),
      enrollmentYear: 2024,
    },
    {
      email: "john@student.cm",
      matricNumber: "ST2024003",
      firstName: "John",
      lastName: "Fon",
      level: "200",
      facultyId: biochem.facultyId,
      departmentId: biochem.id,
      phone: "+237670000003",
      dateOfBirth: new Date("2004-03-10"),
      enrollmentYear: 2023,
    },
    {
      email: "sarah@student.cm",
      matricNumber: "ST2024004",
      firstName: "Sarah",
      lastName: "Njume",
      level: "200",
      facultyId: accounting.facultyId,
      departmentId: accounting.id,
      phone: "+237670000004",
      dateOfBirth: new Date("2004-11-30"),
      enrollmentYear: 2023,
    },
  ];

  for (const studentData of students) {
    // Create User first
    const user = await prisma.user.create({
      data: {
        email: studentData.email,
        password: hashedPassword,
        role: "student",
      },
    });

    // Then create Student linked to User
    await prisma.student.create({
      data: {
        userId: user.id,
        matricNumber: studentData.matricNumber,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        dateOfBirth: studentData.dateOfBirth,
        phone: studentData.phone,
        level: studentData.level,
        facultyId: studentData.facultyId,
        departmentId: studentData.departmentId,
        enrollmentYear: studentData.enrollmentYear,
      },
    });

    console.log(`✅ Created ${studentData.firstName}`);
  }

  console.log("\n📧 Login credentials:");
  console.log("Email: peter@student.cm | Password: password123");
  console.log("Email: marie@student.cm | Password: password123");
  console.log("Email: john@student.cm | Password: password123");
  console.log("Email: sarah@student.cm | Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
