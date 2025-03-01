import { Hono } from "hono";
import addContent from "../services/contentService.js";
import getAllContents from "../services/contentService.js";
import deleteContentById from "../services/contentService.js";

const contentController = new Hono();

// Route untuk menambahkan konten
contentController.post("/add", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Data received from frontend:", body); // Logging data

    // Panggil service untuk menambahkan konten
    const newContent = await addContent(body);

    return c.json({ success: true, data: newContent }, 201);
  } catch (error) {
    console.error("Error in /add route:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

// Route untuk mendapatkan semua konten
contentController.get("/all", async (c) => {
  try {
    const contents = await getAllContents();
    console.log("Data sent to frontend:", contents); // Logging data

    if (!contents || contents.length === 0) {
      return c.json({ success: true, data: [] }, 200); // Kembalikan array kosong jika tidak ada data
    }

    return c.json({ success: true, data: contents }, 200);
  } catch (error) {
    console.error("Error in /all route:", error);
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
