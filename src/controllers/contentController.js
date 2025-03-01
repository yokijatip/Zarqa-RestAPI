import { Hono } from "hono";
import {
  addContent,
  getAllContents,
  deleteContentById,
  contentSchema,
} from "../services/contentService.js";

const contentController = new Hono();

// Route untuk menambahkan konten
contentController.post("/add", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Data received from frontend:", body);

    // Validasi dengan error handling yang lebih baik
    try {
      const validatedData = contentSchema.parse(body);
      const newContent = await addContent(validatedData);
      const allContents = await getAllContents();
      return c.json({ success: true, data: allContents }, 201);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationError.errors || validationError.message,
        },
        400
      );
    }
  } catch (error) {
    console.error("Error in /add route:", error);
    return c.json(
      {
        success: false,
        message: "Failed to process request",
        error: error.message,
      },
      400
    );
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

    // Ambil semua konten setelah penghapusan
    const allContents = await getAllContents();

    return c.json({ success: true, data: allContents }, 200);
  } catch (error) {
    console.error("Error in /delete route:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default contentController;
