import { sendEmail } from "../config/emailConfig.js";

const BASE_URL = "https://zarqa-restapi-production-v2.up.railway.app";

export const emailService = {
  // Email Verifikasi
  sendVerificationEmail: async (user, verificationToken) => {
    const verificationUrl = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="font-size: 16px;">Hi ${user.name},</p>
          <p style="font-size: 16px;">Please click the link below to verify your email address:</p>
          <p style="font-size: 16px;">Tolong klik link dibawah ini ya guna memverifikasi alamat email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 25px; 
                      text-decoration: none; border-radius: 5px; font-size: 16px;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Jika tombol di atas tidak berfungsi, copy dan paste link berikut di browser Anda:</p>
          <p style="font-size: 14px; color: #666; word-break: break-all;">${verificationUrl}</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            Email ini dikirim oleh Zarqa App. Jika Anda tidak merasa mendaftar, abaikan email ini.
          </p>
        </div>
      `,
    });
  },

  // Reset Password
  sendResetPasswordEmail: async (user, resetToken) => {
    const resetUrl = `${BASE_URL}/api/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333; text-align: center;">Reset Password</h2>
          <p style="font-size: 16px;">Hi ${user.name},</p>
          <p style="font-size: 16px;">Please click the link below to reset your password:</p>
          <p style="font-size: 16px;">Mohon klik link dibawah ini untuk reset password Anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #e74c3c; color: white; padding: 12px 25px; 
                      text-decoration: none; border-radius: 5px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Jika tombol di atas tidak berfungsi, copy dan paste link berikut di browser Anda:</p>
          <p style="font-size: 14px; color: #666; word-break: break-all;">${resetUrl}</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
        </div>
      `,
    });
  },

  // Welcome Email
  sendWelcomeEmail: async (user) => {
    await sendEmail({
      to: user.email,
      subject: "Welcome to Zarqa App! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333; text-align: center;">Welcome to Zarqa App! 🎉</h2>
          <p style="font-size: 16px;">Hi ${user.name},</p>
          <p style="font-size: 16px;">Terima kasih sudah bergabung dengan Zarqa App! 😊</p>
          <p style="font-size: 16px;">Kami sangat senang Anda sudah menjadi bagian dari komunitas kami.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} Zarqa App. All rights reserved.
          </p>
        </div>
      `,
    });
  },
};
