import express from 'express'
import { UserController } from '../../controllers/user.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { UserValidation } from '../../validations/user.validation'

const router = express.Router()

router.route('/register').post(UserValidation.register, UserController.register)
router.route('/verify-email').post(UserController.verifyEmail)
router.route('/login').post(UserValidation.login, UserController.login)
router.route('/social-login/:social').post(UserController.socialLogin)
router.route('/refresh-token').get(UserController.refreshToken)
router.route('/logout').get(UserController.logout)

router.route('/get-all-users').get(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, UserController.getAllUsers)
router.route('/get-love-cakes').get(AuthMiddleware.isAuth, UserController.getLoveCakes)
router.route('/update-love-cake').put(AuthMiddleware.isAuth, UserController.updateLoveCake)
router.route('/get-love-status').get(AuthMiddleware.isAuth, UserController.loveStatus)
router.route('/remove-user').put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, UserController.update)
router.route('/')
    .get(AuthMiddleware.isAuth, UserController.getUserInfo)
    .put(AuthMiddleware.isAuth, UserValidation.update, UserController.update)

export const userRoutes = router