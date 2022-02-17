import express from 'express'
import { cakeRoutes } from './cake.route'
import { categoryRoutes } from './category.route'

const router = express.Router()

/**
 * GET v1/status
 */

router.get('/status', (req, res) => res.status(200).json({ status: 'OK!' }))

// Cake APIs
router.use('/category', categoryRoutes)
router.use('/cake', cakeRoutes)

export const apiV1 = router