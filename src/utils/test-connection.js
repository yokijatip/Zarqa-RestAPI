import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Mencoba membuat koneksi
    await prisma.$connect();
    console.log("Successfully connected to MongoDB!");

    // Optional: Mencoba query sederhana
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
