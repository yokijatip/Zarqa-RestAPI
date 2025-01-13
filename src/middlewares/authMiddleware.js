import {verifyToken} from '../config/jwt'

export const authMiddleware = async (c, next) => {
    try {
        const authHeader = c.req.header("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({error: "Unauthorized - No Token Provided"}, 401)
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)

        //     Tambahkan user ke context
        c.set('user', decoded)

        await next()
    } catch (error) {
        return c.json({error: "Unauthorized - Invalid Token"}, 401)
    }
}