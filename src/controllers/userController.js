import {PrismaClient} from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient()

// Schema Validasi
const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(6),
    role: z.string().optional()
})

export const userController = {
//     Get All User
    getAllUsers: async (c) => {
        try {
            const users = await prisma.user.findMany()
            return c.json(users)
        } catch (error) {
            return c.json({error: error.message}, 500)
        }
    },

//     Get User By ID
    getUserById: async (c) => {
        try {
            const id = c.req.param("id")
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            })
            if (!user) {
                return c.json({error: "User not found"}, 404)
            }
            return c.json(user)
        } catch (error) {
            return c.json({error: error.message}, 500)
        }
    },

//     Create User
    createUser: async (c) => {
        try {
            const body = await c.req.json()
            const validatedData = userSchema.parse(body)

            const user = await prisma.user.create({
                data: validatedData
            })

            return c.json(user, 201)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({error: error.errors}, 400)
            }
            return c.json({error: error.message}, 500)
        }
    },

//     Update User
    updateUser: async (c) => {
        try {
            const id = c.req.param('id')
            const body = await c.req.json()
            const validatedData = userSchema.partial().parse(body)

            const user = await prisma.user.update({
                where: {id},
                data: validatedData
            })
            return c.json(user)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({error: error.errors}, 400)
            }
            return c.json({error: error.message}, 500)
        }
    },

//     Delete User
    deleteUser: async (c) => {
        try {
            const id = c.req.param('id')
            await prisma.user.delete({
                where: {id}
            })
            return c.json({message: 'User deleted successfully'})
        } catch (error) {
            return c.json({error: error.message}, 500)
        }
    }

}