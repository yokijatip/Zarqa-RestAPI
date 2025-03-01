import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Skema Validasi untuk input konten
const contentSchema = z.object({
  title: z.string().min(2, { message: "Title mus be at least 3 characters" }),
  image: z.string().url().optional(),
  content: z.string().optional(),
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

// Fungsi untuk mendapatkan semua konten
async function getAllContents() {
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
async function deleteContentById(id) {
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

export default { addContent, getAllContents, deleteContentById };
