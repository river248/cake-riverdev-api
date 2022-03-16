import Joi from 'joi'
import { HttpStatusCode } from '../utils/constants'

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        listProducts: Joi.array().items(Joi.object({
            _id: Joi.string().required().min(24).trim(),
            name: Joi.string().required().min(3).trim(),
            thumbnail: Joi.string().required().min(3).trim(),
            quantity: Joi.number().required().min(1),
            price: Joi.string().required().min(3).trim()
        })).required(),
        customer: Joi.object({
            name: Joi.string().required().min(3).trim(),
            phone: Joi.string().required().min(9).trim(),
            email: Joi.string().min(14).default('').trim(),
            address: Joi.string().required().min(10).trim()
        }).required(),
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