import express from 'express'
import { CategoryController } from '../../controllers/category.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { CategoryValidation } from '../../validations/category.validation'

const router = express.Router()

router.route('/recycle-bin')
    .get(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CategoryController.getAllRemovedCategories)
    
router.route('/soft-remove/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CategoryController.softRemoveCategory)

router.route('/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CategoryValidation.update, CategoryController.update)
    .delete(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CategoryController.removeCategory)

router.route('/')
    .get(CategoryController.getAllCategories)
    .post(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CategoryValidation.createNew, CategoryController.createNew)

export const categoryRoutes = router