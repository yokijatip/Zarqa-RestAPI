import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  formatErrorResponse,
  formatResponse,
} from "../utils/responseFormatter";

const prisma = new PrismaClient();

// Schema Validasi
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.string().optional(),
});

export const userController = {
  //     Get All User
  getAllUsers: async (c) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      return c.json(formatResponse({ users }), 200);
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },

  //     Get User By ID
  getUserById: async (c) => {
    try {
      const id = c.req.param("id");
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      if (!user) {
        return c.json(
          formatErrorResponse(new Error("User not found"), 404),
          404
        );
      }
      return c.json(formatResponse({ user }));
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },

  //     Update User
  updateUser: async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const validatedData = userSchema.partial().parse(body);

      const user = await prisma.user.update({
        where: { id },
        data: validatedData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      return c.json(formatResponse({ user }, "User updated succesfully"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(formatErrorResponse(error, 400), 400);
      }
      return c.json(formatErrorResponse(error), 500);
    }
  },

  //     Delete User
  deleteUser: async (c) => {
    try {
      const id = c.req.param("id");
      await prisma.user.delete({
        where: { id },
      });
      return c.json(formatResponse(null, "User deleted successfully"));
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },
};
