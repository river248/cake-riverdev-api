import express from 'express'
import { CakeController } from '../../controllers/cake.controller'
import { CakeValidation } from '../../validations/cake.validation'

const router = express.Router()

router.route('get-category-recycle-bin')
    .get(CakeController.getSoftRemovedCategoryCakes)
    
router.route('/get-recycle-bin')
    .get(CakeController.getSoftRemovedCakes)

router.route('/remove/:id')
    .put(CakeController.softRemoveCake)

router.route('/remove-category/:categoryID')
    .delete(CakeController.removeCategoryCakes)
    .put(CakeController.softRemoveCategoryCakes)

router.route('/get-category-cake')
    .get(CakeController.getCategoryCake)

router.route('/:id')
    .delete(CakeController.removeCake)
    .put(CakeValidation.update, CakeController.update)
    .get(CakeController.getDetailedCake)

router.route('/')
    .get(CakeController.getCakes)
    .post(CakeValidation.createNew, CakeController.createNew)

export const cakeRoutes = router