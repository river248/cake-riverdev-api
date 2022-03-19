import express from 'express'
import { cakeRoutes } from './cake.route'
import { categoryRoutes } from './category.route'
import { transactionRoutes } from './transaction.route'
import { userRoutes } from './user.route'

const router = express.Router()

/**
 * GET v1/status
 */

router.get('/status', (req, res) => res.status(200).json({ status: 'OK!' }))

// Cake APIs
router.use('/category', categoryRoutes)
router.use('/cake', cakeRoutes)
router.use('/transaction', transactionRoutes)

//User APIs
router.use('/user', userRoutes)

export const apiV1 = router