import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Skema Validasi untuk input konten
// Skema validasi untuk input konten
const contentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  category: z
    .string()
    .min(3, { message: "Category must be at least 3 characters" }),
  image: z.string().url({ message: "Invalid image URL" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
});

export async function addContent(data) {
  try {
    // Validasi input
    const validatedData = contentSchema.parse(data);

    // Simpan data ke database
    const newContent = await prisma.content.create({
      data: {
        title: validatedData.title,
        category: validatedData.category,
        image: validatedData.image,
        content: validatedData.content,
      },
    });

    return newContent;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk mendapatkan semua konten
export async function getAllContents() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: {
        createdAt: "desc", // Urutkan berdasarkan waktu pembuatan (terbaru dulu)
      },
    });
    return contents;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk menghapus konten berdasarkan ID
export async function deleteContentById(id) {
  try {
    const deletedContent = await prisma.content.delete({
      where: {
        id: id, // Gunakan ID sebagai primary key
      },
    });
    if (!deletedContent) {
      throw new Error("Content not found");
    }
  } catch (error) {
    throw error;
  }
}

export default addContent;
