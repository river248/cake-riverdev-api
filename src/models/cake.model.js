import Joi, { date } from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
import { titleCase } from '../utils/formatData'

const cakeCollectionName = 'cakes'
const cakeCollectionSchema = Joi.object({
    name: Joi.string().required().min(3),
    categoryID: Joi.string().required().min(3),
    price: Joi.number().required().min(1),
    description: Joi.string().default('Updating'),
    thumbnail: Joi.string().required().min(3),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await cakeCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const valueValidated = {
            ...value,
            categoryID: ObjectID(value.categoryID),
            createdAt: Date.now()
        }
        const result = await getDB().collection(cakeCollectionName).insertOne(valueValidated)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        let updatedData = {}
        if (data.categoryID)
            updatedData = {
                ...data,
                categoryID: ObjectID(data.categoryID)
            }
        else updatedData = {...data}
        const result = await getDB().collection(cakeCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: updatedData },
            { returnOriginal: false }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getProductByName = async (productName) => {
    try {
        productName = titleCase(productName)
        const result = await getDB().collection(cakeCollectionName).findOne({
            name: productName,
            _destroy: false
        })
        return result
    } catch (error) {
        
    }
}

const getCakes = async (page) => {
    try {
        const cakes = await getDB().collection(cakeCollectionName).aggregate([
            { $match: { _destroy: false } }, {
                $sort: { createdAt: -1, updatedAt: -1 }
            }, {
                $project: { name: 1, thumbnail: 1, categoryID: 1, price: 1 }
            }, { 
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                },
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: [ "$category", 0 ] }, "$$ROOT"
                        ]
                    }
                }
             }, { $project: { category: 0, image: 0, createdAt: 0, updatedAt: 0, _destroy: 0 } }
        ]).toArray()
        const begin = (page - 1)*12
        const end = page*12
        const result = cakes.slice(begin, end)
        const quantityPages = Math.ceil(cakes.length / 12)
        return { cakes: result, quantityPages: quantityPages }
        
    } catch (error) {
        throw new Error(error)
    }
}

const getDetailedCake = async (id) => {
    try {
        const result = await getDB().collection(cakeCollectionName).aggregate([
            { $match: { _id: ObjectID(id), _destroy: false } }, {
                $project: { updatedAt: 0, createdAt: 0, _destroy: 0 }
            }, { 
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                },
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: [ "$category", 0 ] }, "$$ROOT"
                        ]
                    }
                }
             }, { $project: { category: 0, image: 0, createdAt: 0, updatedAt: 0, _destroy: 0 } }
        ]).toArray()
        return result[0]
    } catch (error) {
        throw new Error(error)
    }
}

const getCategoryCake = async (categoryID, page) => {
    try {
        const cakes = await getDB().collection(cakeCollectionName).aggregate([
            { $match: { categoryID: ObjectID(categoryID), _destroy: false } }, {
                $sort: { createdAt: -1, updatedAt: -1 }
            }, {
                $project: { name: 1, thumbnail: 1, categoryID: 1, price: 1 }
            }, { 
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                },
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: [ "$category", 0 ] }, "$$ROOT"
                        ]
                    }
                }
             }, { $project: { category: 0, image: 0, createdAt: 0, updatedAt: 0, _destroy: 0 } }
        ]).toArray()
        const begin = (page - 1)*12
        const end = page*12
        const result = cakes.slice(begin, end)
        const quantityPages = Math.ceil(cakes.length / 12)
        return { cakes: result, quantityPages: quantityPages }
        
    } catch (error) {
        throw new Error(error)
    }
}

const removeCake = async (id) => {
    try {
        const result = await getDB().collection(cakeCollectionName).deleteOne({
            _id: ObjectID(id)
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeCategoryCakes = async (categoryID) => {
    try {
        const result = await getDB().collection(cakeCollectionName).deleteMany({
            categoryID: ObjectID(categoryID)
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const softRemoveCategoryCakes = async (categoryID) => {
    try {
        const cakes = await getDB().collection(cakeCollectionName).find({
            categoryID: ObjectID(categoryID),
            _destroy: false
        }).toArray()
        const result = cakes.map( async (cake) => {
            await getDB().collection(cakeCollectionName).findOneAndUpdate(
                { _id: ObjectID(cake._id) },
                { $set: { updatedAt: Date.now(), _destroy: true } },
                { returnOriginal: false }
            )
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getSoftRemovedCakes = async (page) => {
    try {
        const cakes = await getDB().collection(cakeCollectionName).aggregate([
            { $match: { _destroy: true } }, {
                $sort: { updatedAt: -1 }
            }, {
                $project: { name: 1, thumbnail: 1, categoryID: 1, price: 1 }
            }, { 
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                },
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: [ "$category", 0 ] }, "$$ROOT"
                        ]
                    }
                }
             }, { $project: { category: 0, image: 0, createdAt: 0, updatedAt: 0, _destroy: 0 } }
        ]).toArray()
        const begin = (page - 1)*12
        const end = page*12
        const result = cakes.slice(begin, end)
        const quantityPages = Math.ceil(cakes.length / 12)
        return { cakes: result, quantityPages: quantityPages }
        
    } catch (error) {
        throw new Error(error)
    }
}

const getSoftRemovedCategoryCakes = async (categoryID, page) => {
    try {
        const cakes = await getDB().collection(cakeCollectionName).aggregate([
            { $match: { categoryID: ObjectID(categoryID), _destroy: true } }, {
                $sort: { updatedAt: -1 }
            }, {
                $project: { name: 1, thumbnail: 1, categoryID: 1, price: 1 }
            }, { 
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                },
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: [ "$category", 0 ] }, "$$ROOT"
                        ]
                    }
                }
             }, { $project: { category: 0, image: 0, createdAt: 0, updatedAt: 0, _destroy: 0 } }
        ]).toArray()
        const begin = (page - 1)*12
        const end = page*12
        const result = cakes.slice(begin, end)
        const quantityPages = Math.ceil(cakes.length / 12)
        return { cakes: result, quantityPages: quantityPages }
        
    } catch (error) {
        throw new Error(error)
    }
}

export const CakeModel = {
    createNew,
    update,
    getProductByName,
    getCakes,
    getDetailedCake,
    getCategoryCake,
    removeCake,
    removeCategoryCakes,
    softRemoveCategoryCakes,
    getSoftRemovedCakes,
    getSoftRemovedCategoryCakes
}