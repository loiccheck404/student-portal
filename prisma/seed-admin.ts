import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Creating admin account...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.create({
    data: {
      name: "System Admin",
      email: "admin@university.cm",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Admin created:");
  console.log("   Email: admin@university.cm");
  console.log("   Password: admin123");
  console.log("   ID:", admin.id);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
