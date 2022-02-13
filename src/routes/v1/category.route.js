import express from 'express'
import { CategoryController } from '../../controllers/category.controller'

const router = express.Router()

router.route('/')
    .get(CategoryController.getAllCategories)

export const categoryRoutes = router