import { Hono } from "hono";
import { addContent } from "../services/contentService.js";

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

export default contentController;
