import {Hono} from "hono";
import {authController} from "../controllers/authController.js";

const authRouter = new Hono()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)

export default authRouter