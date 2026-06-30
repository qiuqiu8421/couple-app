import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function main() {
  const userOne = {
    username: requireEnv("SEED_USER_ONE_USERNAME"),
    password: requireEnv("SEED_USER_ONE_PASSWORD"),
    name: process.env.SEED_USER_ONE_NAME ?? "User One",
  };
  const userTwo = {
    username: requireEnv("SEED_USER_TWO_USERNAME"),
    password: requireEnv("SEED_USER_TWO_PASSWORD"),
    name: process.env.SEED_USER_TWO_NAME ?? "User Two",
  };

  const hashed1 = await bcrypt.hash(userOne.password, 10);
  const hashed2 = await bcrypt.hash(userTwo.password, 10);

  await prisma.user.upsert({
    where: { username: userOne.username },
    update: {},
    create: { username: userOne.username, password: hashed1, name: userOne.name },
  });

  await prisma.user.upsert({
    where: { username: userTwo.username },
    update: {},
    create: { username: userTwo.username, password: hashed2, name: userTwo.name },
  });

  // Create anniversaries
  await prisma.anniversary.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "在一起纪念日",
        date: new Date("2019-09-15"),
        description: "我们在一起的那天",
      },
      {
        title: "纪念日 A",
        date: new Date("2001-05-20"),
        description: "示例纪念日",
      },
      {
        title: "纪念日 B",
        date: new Date("1999-07-01"),
        description: "示例纪念日",
      },
    ],
  });

  console.log("数据库初始化完成！");
  console.log(`账号: ${userOne.username}`);
  console.log(`账号: ${userTwo.username}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
