import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import pino from "pino";
import { logger } from "hono/logger";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Inisialisasi Hono
const app = new Hono();

// Inisialisasi Prisma
const prisma = new PrismaClient();

// Setup Logger
const log = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// Global Middleware
app.use("*", logger());
app.use("*", cors());
app.use("*", rateLimitMiddleware());

// Route Dasar
app.get("/", (c) => {
  return c.json({
    stausCode: 200,
    success: "success",
    message: "Welcome to The Rest API",
  });
});

// Routes
app.route("/api/auth", authRouter);
app.route("/api/users", userRouter);
app.route("/api/files", fileRouter);

// Error Handling
app.onError(errorHandler);

// Start Server
const port = process.env.PORT || 3000;
console.log(`Server running on http://localhost:${port}`);

// Add pino logger for server events
log.info(`Server started on http://localhost:${port}`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    log.info(`Server is ready to accept connections`);
  }
);
