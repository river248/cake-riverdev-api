import Joi from 'joi'
import bcrypt from 'bcrypt'
import { getDB } from '../config/mongodb'
import { ObjectId } from 'mongodb'

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

const getUserInfo = async (id) => {
    try {
        const result = await getDB().collection(userCollectionName).findOne(
            { _id: ObjectId(id), _destroy: false },
            { $project: { username: 1, email: 1, avatar: 1, phone: 1 }}
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllUsers = async (page) => {
    try {
        const listUsers = await getDB().collection(userCollectionName).find({
            $project : { username: 1, email: 1, avatar: 1, role: 1, _destroy: 1 }
        })
        const result = listUsers.slice(0, page*12)
        return {users: [...result], quantityPages: Math.ceil(listUsers.length/12)}
    } catch (error) {
        throw new Error(error)
    }
}

const getLoveCakes = async (userID, page) => {
    try {
        const listCakes = await getDB().collection(userCollectionName).aggregate([
            { $match: { _id: ObjectId(userID), _destroy: false } },
            { $unwind: { path: '$love' } },
            { $project: { _id: 0, love: 1 } },
            {
                $lookup: {
                    from: 'cakes',
                    let: { loved: '$love' },
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ '$_id', '$$loved'] },
                                        { $eq : [ '$_destroy', false] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, name: 1, thumbnail: 1 } }
                    ],
                    as: 'loved'
                }
            }, {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$loved', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { loved: 0, love: 0 } }
        ]).toArray()

        const result = listCakes.slice(0, page*12)
        return { lovedCakes: [...result], quantityPages: Math.ceil(listCakes.length/12) }

    } catch (error) {
        throw new Error(error)
    }
}

const updateLoveCake = async (userID, cakeID) => {
    try {
        let result = null
        const checkExist = await getDB().collection(userCollectionName).findOne({
            _id: ObjectId(userID),
            love: ObjectId(cakeID),
            _destroy: false
        })
        if (checkExist)
            result = await getDB().collection(userCollectionName).findOneAndUpdate(
                { _id: ObjectId(userID), _destroy: false },
                { $pull: { love: ObjectId(cakeID) } },
                { returnOriginal: false }
            )
        else
            result = await getDB().collection(userCollectionName).findOneAndUpdate(
                { _id: ObjectId(userID), _destroy: false },
                { $push: { love: ObjectId(cakeID) } },
                { returnOriginal: false }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const loveStatus = async (userID, cakeID) => {
    try {
        const result = await getDB().collection(userCollectionName).findOne({
            _id: ObjectId(userID),
            love: ObjectId(cakeID),
            _destroy: false
        })
        if (result)
            return true
        else
            return false
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const result = await getDB().collection(userCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: data },
            { returnOriginal: false}
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const UserModel = {
    createNew,
    getUserByEmail,
    login,
    getUserInfo,
    getAllUsers,
    getLoveCakes,
    updateLoveCake,
    loveStatus,
    update
}