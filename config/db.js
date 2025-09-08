import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
  }
};

export { prisma, connectDb };
