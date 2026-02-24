import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true },
  });

  if (users.length === 0) {
    console.log("ユーザーが登録されていません。");
  } else {
    console.log("登録ユーザー一覧:");
    for (const u of users) {
      console.log(`  ${u.email} - role: ${u.role}`);
    }
  }

  await prisma.$disconnect();
}

main();
