import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'

const categoryCollectionName = 'categories'
const categoryCollectionSchema = Joi.object({
    categoryName: Joi.string().required().min(3),
    image: Joi.string().required().min(3),
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
                categoryName: 1,
                image: 1
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
                categoryName: 1,
                image: 1,
                updatedAt: 1
            }).toArray()

        return result
        
    } catch (error) {
        throw new Error(error)
    }
}

const getCategoryName = async (name) => {
    try {
        const result = await getDB().collection(categoryCollectionName).findOne({
            categoryName: name,
            _destroy: false
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const CategoryModel = {
    createNew,
    update,
    removeCategory,
    getAllCategories,
    getAllRemovedCategories,
    getCategoryName
}