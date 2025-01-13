import { Hono } from "hono";
import { authController } from "../controllers/authController.js";

const authRouter = new Hono();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
