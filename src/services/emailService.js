import { sendEmail } from "../config/emailConfig.js";

const BASE_URL = "https://zarqa-restapi-production.up.railway.app";
// const BASE_URL = "http://localhost:3000"; // Development URL

export const emailService = {
  // Email Verifikasi
  sendVerificationEmail: async (user, verificationToken) => {
    const verificationUrl = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    //const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Email Verification",
      html: `
        <h1>Email Verification</h1>
        <p>Hi ${user.name},</p>
        <p>Please click the link below to verify your email address:</p>
        <p>Tolong klik link dibawah ini ya guna memverifikasi alamat email:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>Jika button diatas tidak berfungsi, copy dan paste link berikut di browser Anda:</p>
        <p>${verificationUrl}</p>
      `,
    });
  },

  //   Reset Password
  sendResetPasswordEmail: async (user, resetToken) => {
    const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `
        <h1>Password Reset</h1>
        <p>Hi ${user.name},</p>
        <p>Please click the link below to reset your password:</p>
        <p>Mohon klik link dibawah ini untuk reset password anda</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    });
  },

  //   Welcome Email
  sendWelcomeEmail: async (user) => {
    await sendEmail({
      to: user.email,
      subject: "Welcome to the App",
      html: `
        <h1>Welcome ${user.name} 😁!</h1>
        <p>Makasih udah gabung ke aplikasi ini ya😎.</p>
        <p>Kami sangat senang anda sudah bergabung</p>
        `,
    });
  },
};
