import { TransactionService } from '../services/transaction.service'
import { HttpStatusCode } from '../utils/constants'

const createNew = async (req, res) => {
    try {
        const result = await TransactionService.createNew(req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const TransactionController = {
    createNew,

}