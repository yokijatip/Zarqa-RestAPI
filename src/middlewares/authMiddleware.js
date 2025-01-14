import { verifyToken } from "../config/jwt.js";
import { formatErrorResponse } from "../utils/responseFormatter.js";

export const authMiddleware = async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        formatErrorResponse(new Error("Unauthorized - No Token Provided")),
        401
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    //     Tambahkan user ke context
    c.set("user", decoded);

    await next();
  } catch (error) {
    return c.json(
      formatErrorResponse(new Error("Unauthorized - Invalid Token")),
      401
    );
  }
};
