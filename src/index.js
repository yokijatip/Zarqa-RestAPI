import {Hono} from "hono";
import {cors} from 'hono/cors'
import pino from "pino";
import {logger} from "hono/logger";
import {PrismaClient} from "@prisma/client";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";

// Inisialisasi Hono
const app = new Hono()

// Inisialisasi Prisma
const prisma = new PrismaClient()

// Setup Logger
const log = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

// Middleware
app.use("*", logger())
app.use("*", cors())

// Route Dasar
app.get("/", (c) => {
    return c.json({message: "Welcome to The Rest API"})
})

// Routes
app.route('/api/auth', authRouter)
app.route('/api/users', userRouter)


// Error Handling
app.onError((err, c) => {
    log.error(err)
    return c.json({error: "Internal Server Error"}, 500)
})

// Start Server
const port = process.env.PORT || 3000
console.log(`Server running on http://localhost:${port}`)

export default {
    port,
    fetch: app.fetch
}
