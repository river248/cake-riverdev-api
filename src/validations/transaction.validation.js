import Joi from 'joi'
import { HttpStatusCode } from '../utils/constants'

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        listProducts: Joi.array().items(Joi.object({
            _id: Joi.string().required().min(24),
            name: Joi.string().required().min(3),
            quantity: Joi.number().required().min(1),
            price: Joi.string().required().min(3)
        })).required(),
        content: Joi.string().required().min(10),
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: new Error(error).message
        })
    }
}

export const TransactionValidation = {
    createNew,
}