import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../config/jwt.js";
import {
  formatResponse,
  formatErrorResponse,
} from "../utils/responseFormatter.js";
import { emailService } from "../services/emailService.js";

const prisma = new PrismaClient();

// Generate random token
const generateRandomToken = () => crypto.randomBytes(32).toString("hex");

// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

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
      const verificationToken = generateRandomToken();

      //     Create User
      const user = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword,
          verificationToken,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      //     Send Verification Email
      await emailService.sendVerificationEmail(user, verificationToken);

      return c.json(
        formatResponse(
          { user },
          "Registration successful. Please check your email to verify your account.",
          201
        ),
        201
      );
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },

  // Verify Email
  verifyEmail: async (c) => {
    try {
      const token = await c.req.query("token");

      // Validasi token harus ada
      if (!token) {
        return c.json(
          formatErrorResponse(new Error("Verification token is required"), 400),
          400
        );
      }

      // Cari user dengan token tersebut
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          isEmailVerified: false, // Pastikan belum diverifikasi
        },
      });

      if (!user) {
        return c.json(
          formatErrorResponse(
            new Error("Invalid or expired verification token"),
            400
          ),
          400
        );
      }

      // Update user menjadi terverifikasi
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isEmailVerified: true,
          verificationToken: null, // Hapus token setelah digunakan
        },
      });

      // Kirim welcome email
      try {
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Lanjutkan proses meski email gagal terkirim
      }

      return c.json(
        formatResponse(null, "Email verified successfully. You can now login")
      );
    } catch (error) {
      console.error("Email verification error:", error);
      return c.json(formatErrorResponse(error), 500);
    }
  },

  // Request password reset
  forgotPassword: async (c) => {
    try {
      const { email } = await c.req.json();

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return c.json(
          formatResponse(null, "Jika akun nya ada maka kode OTP akan dikirim.")
        );
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save OTP to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetOTP: otp,
          resetOTPExpires: otpExpires,
        },
      });

      // Send OTP via email
      await emailService.sendResetPasswordOTP(user, otp);

      return c.json(formatResponse(null, "OTP sudah dikirim di email."));
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },

  // Verify OTP
  verifyOTP: async (c) => {
    try {
      const { email, otp } = await c.req.json();

      const user = await prisma.user.findFirst({
        where: {
          email,
          resetOTP: otp,
          resetOTPExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return c.json(
          formatErrorResponse(new Error("Invalid or expired OTP"), 400),
          400
        );
      }

      // Generate temporary token for password reset
      const tempToken = generateToken(
        { userId: user.id, purpose: "reset-password" },
        "15m"
      );

      return c.json(
        formatResponse({ token: tempToken }, "OTP verified successfully")
      );
    } catch (error) {
      return c.json(formatErrorResponse(error), 500);
    }
  },

  // Reset password with verified OTP
  resetPassword: async (c) => {
    try {
      const { token, newPassword } = await c.req.json();

      // Verify token
      const decoded = verifyToken(token);
      if (decoded.purpose !== "reset-password") {
        throw new Error("Invalid token purpose");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear OTP
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          password: hashedPassword,
          resetOTP: null,
          resetOTPExpires: null,
        },
      });

      return c.json(
        formatResponse(
          null,
          "Password reset successful. You can now login with your new password."
        )
      );
    } catch (error) {
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
          isEmailVerified: true,
        },
      });

      if (!user) {
        return c.json(
          formatErrorResponse(new Error("Invalid credentials"), 401),
          401
        );
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return c.json(
          formatErrorResponse(
            new Error("Please verify your email before logging in"),
            401
          ),
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
