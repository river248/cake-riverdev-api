import Joi from 'joi'
import { HttpStatusCode } from '../utils/constants'

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string().required().min(3).trim(),
        thumbnail: Joi.string().required().min(3).trim()
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(error).message
        })
    }
}

const update = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string().min(3).trim(),
        thumbnail: Joi.string().min(3).trim()
    })
    try {
        await condition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
        })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(error).message
        })
    }
}

export const CategoryValidation = {
    createNew,
    update
}