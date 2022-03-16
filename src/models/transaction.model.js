import Joi from 'joi'
import { getDB } from '../config/mongodb'

const transactionCollectionName = 'transactions'
const transactionCollectionSchema = Joi.object({
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
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await transactionCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const validatedData = {
            ...value,
            createAt: Date.now()
        }

        const result = await getDB().collection(transactionCollectionName).insertOne(validatedData)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

export const TransactionModel = {
    createNew,
}