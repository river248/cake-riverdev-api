import express from 'express'
import { CategoryController } from '../../controllers/category.controller'
import { CategoryValidation } from '../../validations/category.validation'

const router = express.Router()

router.route('/recycle-bin')
    .get(CategoryController.getAllRemovedCategories)
    
router.route('/soft-remove/:id')
    .put(CategoryController.softRemoveCategory)

router.route('/:id')
    .put(CategoryValidation.update, CategoryController.update)
    .delete(CategoryController.removeCategory)

router.route('/')
    .get(CategoryController.getAllCategories)
    .post(CategoryValidation.createNew, CategoryController.createNew)

export const categoryRoutes = router