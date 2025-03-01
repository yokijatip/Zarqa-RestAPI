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

    // Validasi input menggunakan Zod
    const validatedData = contentSchema.parse(body);

    // Panggil service untuk menambahkan konten
    const newContent = await addContent(validatedData);

    // Ambil semua konten setelah penambahan
    const allContents = await getAllContents();

    return c.json({ success: true, data: allContents }, 201);
  } catch (error) {
    console.error("Error in /add route:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

// Route untuk mendapatkan semua konten
contentController.get("/all", async (c) => {
  try {
    const contents = await getAllContents();
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

contentController.delete("/delete/:id", async (c) => {
  try {
    const { id } = c.req.param(); // Ambil ID dari parameter URL
    await deleteContentById(id);

    // Ambil semua konten setelah penghapusan
    const allContents = await getAllContents();

    return c.json({ success: true, data: allContents }, 200);
  } catch (error) {
    console.error("Error in /delete route:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default contentController;
