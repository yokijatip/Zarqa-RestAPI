import { Hono } from "hono";
import { fileController } from "../controllers/fileController";
import { authMiddleware } from "../middlewares/authMiddleware";

const fileRouter = new Hono();

// Apply auth middleware to all routes
fileRouter.use("*", authMiddleware);

// Routes
fileRouter.post("/upload", fileController.uploadFile);
fileRouter.get("/", fileController.getUserFiles);
fileRouter.delete("/:id", fileController.deleteFile);

export default fileRouter;
