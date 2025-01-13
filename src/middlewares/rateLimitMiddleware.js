import { RateLimiterMemory } from "rate-limiter-flexible";
import { formatErrorResponse } from "../utils/responseFormatter";

const rateLimiter = new RateLimiterMemory({
  points: 200, // Jumlah Request yang di inginkan
  duration: 60, // Per 60 Detik
});

export const rateLimitMiddleware = () => {
  return async (c, next) => {
    try {
      const ip = c.req.header("x-forwarded-for") || "default-ip";
      await rateLimiter.consume(ip);

      return next();
    } catch (error) {
      return c.json(
        formatErrorResponse(new Error("Too many requests"), 429),
        429
      );
    }
  };
};
