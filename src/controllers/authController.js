import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";
import {
  formatResponse,
  formatErrorResponse,
} from "../utils/responseFormatter.js";

const prisma = new PrismaClient();

// Validation Schema
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authController = {
  //     Regiter User
  register: async (c) => {
    try {
      const body = await c.req.json();
      const validatedData = registerSchema.parse(body);

      //     Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      //     Create User
      const user = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      //     Generate Token
      const token = generateToken({ userId: user.id });

      return c.json(
        formatResponse({ user }, "User registered successfully", 201),
        201
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(formatErrorResponse(error, 400), 400);
      }
      return c.json(formatErrorResponse(error), 500);
    }
  },

  login: async (c) => {
    try {
      const body = await c.req.json();
      const validatedData = loginSchema.parse(body);

      //     Find user
      const user = await prisma.user.findUnique({
        where: {
          email: validatedData.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
        },
      });

      if (!user) {
        return c.json(
          formatErrorResponse(new Error("User not found"), 401),
          401
        );
      }

      //     Check Password
      const validPassword = await bcrypt.compare(
        validatedData.password,
        user.password
      );
      if (!validPassword) {
        return c.json(
          formatErrorResponse(new Error("Invalid credentials"), 401),
          401
        );
      }

      //     Generate Token
      const token = generateToken({ userId: user.id });

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return c.json(formatResponse({ user: userData, token }, "Login success"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(formatErrorResponse(error, 400), 400);
      }
      return c.json(formatErrorResponse(error), 500);
    }
  },
};
