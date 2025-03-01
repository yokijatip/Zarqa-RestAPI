import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Skema Validasi untuk input konten
const contentSchema = z.object({
  title: z.string().min(2, { message: "Title mus be at least 3 characters" }),
  image: z.string().optional(),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
});

// Fungsi untuk menambahkan konten baru
async function addContent(data) {
  try {
    // Validasi input
    const validateData = contentSchema.parse(data);

    // Menambahkan konten baru ke database
    const newContent = await prisma.content.create({
      data: {
        title: validateData.title,
        image: validateData.image || null,
        content: validateData.content,
      },
    });

    return newContent;
  } catch (error) {
    throw error;
  }
}

module.exports = { addContent };
