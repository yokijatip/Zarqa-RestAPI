import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "Yokijp30!"

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d"
    })
}

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}