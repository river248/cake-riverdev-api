import express from 'express'
import { UserController } from '../../controllers/user.controller'
import { UserValidation } from '../../validations/user.validation'

const router = express.Router()

router.route('/register').post(UserValidation.register, UserController.register)
router.route('/verify-email').post(UserController.verifyEmail)
router.route('/login').post(UserValidation.login, UserController.login)
router.route('/social-login/:social').post(UserController.socialLogin)
router.route('/refresh-token').get(UserController.refreshToken)
router.route('/logout').get(UserController.logout)

export const userRoutes = router