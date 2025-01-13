import { sendEmail } from "../config/emailConfig.js";

const testEmail = async () => {
  try {
    console.log("Attempting to send test email...");

    await sendEmail({
      to: "yokijati@gmail.com",
      subject: "Test Email from Zarqa API",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Zarqa API.</p>
        <p>If you receive this, your email configuration is working correctly.</p>
      `,
    });

    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error.message);
    console.error("Full error:", error);
  }
};

// Run the test
testEmail();
