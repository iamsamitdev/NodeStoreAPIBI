import express, { Router } from 'express'
import * as authController  from '../controllers/authController'

// Initialize Router
const router: Router = express.Router()

// Define Routes
router.post('/register', authController.register)
router.post('/login', authController.login)

// Export Router
export default router