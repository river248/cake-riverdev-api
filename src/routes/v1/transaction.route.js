import express from 'express'
import { TransactionController } from '../../controllers/transaction.controller'
import { TransactionValidation } from '../../validations/transaction.validation'

const router = express.Router()

router.route('/')
    .post(TransactionValidation.createNew, TransactionController.createNew)

export const transactionRoutes = router