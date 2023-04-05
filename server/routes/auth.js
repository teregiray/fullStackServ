import { Router } from "express"
import { register, login, getMe } from '../controllers/auth.js'
import { checkAuth } from "../utils/checkAuth.js"
const router = new Router()

// Reg
// http://localhost:3002/api/auth/register
router.post('/register', register)

// Log
// http://localhost:3002/api/auth/login
router.post('/login', login)

// getMe
// http://localhost:3002/api/auth/me
router.get('/me', checkAuth,  getMe) // при заходе на сайт первым делом проверяется токен, функция next нужна для того, чтобы перейти дальше к getMe

export default router;