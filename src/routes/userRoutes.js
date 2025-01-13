import { Hono } from 'hono'
import { userController } from '../controllers/userController.js'

const userRouter = new Hono()

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', userController.getUserById)
userRouter.post('/', userController.createUser)
userRouter.patch('/:id', userController.updateUser)
userRouter.delete('/:id', userController.deleteUser)

export default userRouter