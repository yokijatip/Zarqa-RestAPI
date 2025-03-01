import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Skema Validasi untuk input konten
export const contentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  category: z
    .string()
    .min(3, { message: "Category must be at least 3 characters" }),
  image: z.string().url({ message: "Invalid image URL" }),
  content: z
    .string()
    .min(3, { message: "Content must be at least 3 characters" }),
});

export async function addContent(data) {
  try {
    const newContent = await prisma.content.create({
      data: {
        title: data.title,
        category: data.category,
        image: data.image,
        content: data.content,
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
    return contents; // Pastikan ini mengembalikan array
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk menghapus konten berdasarkan ID
export async function deleteContentById(id) {
  try {
    const deletedContent = await prisma.content.delete({
      where: {
        id: parseInt(id), // Konversi id ke number jika perlu
      },
    });
    if (!deletedContent) {
      throw new Error("Content not found");
    }
    return deletedContent;
  } catch (error) {
    throw error;
  }
}
