import { Hono } from "hono";
import {
  addContent,
  getAllContents,
  deleteContentById,
} from "../services/contentService.js";

const contentController = new Hono();

// Route untuk menambahkan konten
contentController.post("/add", async (c) => {
  try {
    const body = await c.req.json();

    // Panggil service untuk menambahkan konten
    const newContent = await addContent(body);

    return c.json({ success: true, data: newContent }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

// Route untuk mendapatkan semua konten
contentController.get("/all", async (c) => {
  try {
    const contents = await getAllContents();
    return c.json({ success: true, data: contents }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Route untuk menghapus konten berdasarkan ID
contentController.delete("/delete/:id", async (c) => {
  try {
    const { id } = c.req.param(); // Ambil ID dari parameter URL
    await deleteContentById(id);
    return c.json(
      { success: true, message: "Content deleted successfully" },
      200
    );
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default contentController;
