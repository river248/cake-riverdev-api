import Joi from 'joi'
import bcrypt from 'bcrypt'
import { getDB } from '../config/mongodb'

const userCollectionName = 'users'
const userCollectionSchema = Joi.object({
    username: Joi.string().required().min(3).max(50).trim(),
    email: Joi.string().required().min(15).max(50).trim(),
    password: Joi.string().required().min(8),
    phone: Joi.string().min(9).max(11).default('').trim(),
    avatar: Joi.string().default('https://res.cloudinary.com/no-music-no-life/image/upload/v1637370860/avatar-user-higico_dfrmov.jpg'),
    role: Joi.string().default('user'),
    love: Joi.array().items(Joi.string()).default([]),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const valueValidated = {
            ...value,
            createAt: Date.now()
        }
        await getDB().collection(userCollectionName).insertOne(valueValidated)
        return 'Successfully verified!'
    } catch (error) {
        throw new Error(error)
    }

}

const getUserByEmail = async (email) => {
    try {
        const result = await getDB().collection(userCollectionName).findOne(
            { email: email, _destroy: false },
            { $project: { username: 1, email: 1, password: 1, phone: 1, role: 1 } }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const login = async (data) => {
    try {

        let user = await getDB().collection(userCollectionName).findOne(
            { email: data.email, _destroy: false })
        if (!user) return null
        const isMatch = await bcrypt.compare(data.password, user.password)
        if (!isMatch)
            return undefined
        else {
            const userInfo = { _id: user._id, role: user.role }
            return userInfo
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const UserModel = {
    createNew,
    getUserByEmail,
    login
}