import express from 'express'
import { CakeController } from '../../controllers/cake.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { CakeValidation } from '../../validations/cake.validation'

const router = express.Router()

router.route('/search')
    .get(CakeController.searchBy)

router.route('/get-category-recycle-bin')
    .get(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeController.getSoftRemovedCategoryCakes)
    
router.route('/get-recycle-bin')
    .get(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeController.getSoftRemovedCakes)

router.route('/remove/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeController.softRemoveCake)

router.route('/remove-category/:categoryID')
    .delete(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeController.removeCategoryCakes)
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeController.softRemoveCategoryCakes)

router.route('/get-category-cake')
    .get(CakeController.getCategoryCakes)

router.route('/:id')
    .delete(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeController.removeCake)
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeValidation.update, CakeController.update)
    .get(CakeController.getDetailedCake)

router.route('/')
    .get(CakeController.getCakes)
    .post(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, CakeValidation.createNew, CakeController.createNew)

export const cakeRoutes = router