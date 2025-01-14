import { PrismaClient } from "@prisma/client";
import {
  formatResponse,
  formatErrorResponse,
} from "../utils/responseFormatter.js";
import { validateFile } from "../utils/fileValidator.js";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const prisma = new PrismaClient();
const UPLOAD_DIR = "./uploads";

// Pastikan direktori upload ada
try {
  await mkdir(UPLOAD_DIR, { recursive: true });
} catch (error) {
  console.error("Error creating upload directory:", error);
}

export const fileController = {
  // Upload file
  uploadFile: async (c) => {
    try {
      const userId = c.get("user").userId;
      const body = await c.req.parseBody();
      const file = body.file;

      try {
        // Validasi file
        validateFile(file);
      } catch (validationError) {
        return c.json(formatErrorResponse(validationError, 400), 400);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name;
      const filename = `${timestamp}-${originalName}`;
      const filepath = join(UPLOAD_DIR, filename);

      // Save file
      if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(arrayBuffer));
      }

      // Save to database
      const fileDoc = await prisma.file.create({
        data: {
          filename: originalName,
          path: filepath,
          mimetype: file.type,
          size: file.size,
          userId,
        },
      });

      return c.json(
        formatResponse({ file: fileDoc }, "File uploaded successfully", 201),
        201
      );
    } catch (error) {
      console.error("Upload error:", error);
      return c.json(formatErrorResponse(error), 500);
    }
  },

  // Get user files
  getUserFiles: async (c) => {
    try {
      const userId = c.get("user").userId;
      const files = await prisma.file.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return c.json(formatResponse({ files }));
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },

  // Delete file
  deleteFile: async (c) => {
    try {
      const fileId = c.req.param("id");
      const userId = c.get("user").userId;

      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) {
        return c.json(
          formatErrorResponse(new Error("File not found"), 404),
          404
        );
      }

      // Delete from database
      await prisma.file.delete({
        where: { id: fileId },
      });

      // Delete physical file
      try {
        await unlink(file.path);
      } catch (error) {
        console.error("Error deleting physical file:", error);
      }

      return c.json(formatResponse(null, "File deleted successfully"));
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },
};
