import Joi from 'joi'
import { getDB } from '../config/mongodb'

const transactionCollectionName = 'transactions'
const transactionCollectionSchema = Joi.object({
    listProducts: Joi.array().items(Joi.object({
        _id: Joi.string().required().min(24),
        name: Joi.string().required().min(3),
        quantity: Joi.number().required().min(1),
        price: Joi.string().required().min(3)
    })).required(),
    content: Joi.string().required().min(10),
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