import express, { Router } from 'express'
import * as productController  from '../controllers/productController'

// Initialize Router
const router: Router = express.Router()

// Define Routes
// Get All Products
router.get('/', productController.getAllProducts)

// Get Products By ID
router.get('/:id', productController.getProductsById)

// Create Products
router.post('/', productController.createProducts)

// Update Products
router.put('/:id', productController.updateProducts)

// Delete Products
router.delete('/:id', productController.deleteProducts)

// Export Router
export default router