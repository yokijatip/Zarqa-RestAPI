import { formatErrorResponse } from "../utils/responseFormatter";

export const errorHandler = async (err, c) => {
  console.error("Error:", err);

  // Prisma error handling
  if (err.code) {
    switch (err.code) {
      case "P2002":
        return c.json(
          formatErrorResponse(new Error("Unique constraint violation"), 409),
          409
        );
      case "P2025":
        return c.json(
          formatErrorResponse(new Error("Record not found"), 404),
          404
        );
    }
  }

  // Default error response
  return c.json(formatErrorResponse(err), err.status || 500);
};
