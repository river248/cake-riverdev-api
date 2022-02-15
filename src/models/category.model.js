import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'

const categoryCollectionName = 'categories'
const categoryCollectionSchema = Joi.object({
    name: Joi.string().required().min(3),
    thumbnail: Joi.string().required().min(3),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await categoryCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const valueValidated = {
            ...value,
            createdAt: Date.now()
        }
        const result = await getDB().collection(categoryCollectionName).insertOne(valueValidated)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const result = await getDB().collection(categoryCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: data },
            { returnOriginal: false }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeCategory = async (id) => {
    try {
        const result = await getDB().collection(categoryCollectionName).deleteOne({
            _id: ObjectID(id)
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllCategories = async () => {
    try {

        const result = await getDB().collection(categoryCollectionName)
            .find({
                _destroy: false
            })
            .project({
                name: 1,
                thumbnail: 1
            }).toArray()

        return result
        
    } catch (error) {
        throw new Error(error)
    }
}

const getAllRemovedCategories = async () => {
    try {

        const result = await getDB().collection(categoryCollectionName)
            .find({
                _destroy: true
            })
            .project({
                name: 1,
                thumbnail: 1,
                updatedAt: 1
            }).toArray()

        return result
        
    } catch (error) {
        throw new Error(error)
    }
}

export const categoryModel = {
    createNew,
    update,
    removeCategory,
    getAllCategories,
    getAllRemovedCategories
}