import { Hono } from "hono";
import { addContent } from "../services/contentService.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const contentController = new Hono();

// Route untuk menambahkan konten
contentController.post("/add", upload.single("image"), async (c) => {
  try {
    const body = c.req.body; // Ambil data dari form-data
    const title = body.get("title");
    const content = body.get("content");
    const imageFile = c.req.file;

    // Proses upload gambar jika ada
    let imageUrl = null;
    if (imageFile) {
      imageUrl = `/uploads/${imageFile.filename}`;
    }

    // Panggil service untuk menambahkan konten
    const newContent = await addContent({
      title: title.toString(),
      image: imageUrl,
      content: content.toString(),
    });

    return c.json({ success: true, data: newContent }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default contentController;
