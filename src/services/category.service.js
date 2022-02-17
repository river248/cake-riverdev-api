import { CategoryModel } from '../models/category.model'
import { titleCase } from '../utils/formatData'

const createNew = async (data) => {
    try {
        const checkExists = await CategoryModel.getCategoryName(data.categoryName)
        if (checkExists)
            return null
        const validateData = {...data, categoryName: titleCase(data.categoryName)}
        const result = await CategoryModel.createNew(validateData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        let updateData = {}
        if (data.categoryName) {
            updateData = {
                ...data,
                categoryName: titleCase(data.categoryName),
                updatedAt: Date.now()
            }
        }
        const result = await CategoryModel.update(id, updateData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeCategory = async (id) => {
    try {
        const result = await CategoryModel.removeCategory(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const softRemoveCategory = async (id) => {
    try {
        const result = await CategoryModel.update(id, { _destroy: true })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllCategories = async () => {
    try {
        const result = await CategoryModel.getAllCategories()

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllRemovedCategories = async () => {
    try {
        const result = await CategoryModel.getAllRemovedCategories()

        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const CategoryService = {
    createNew,
    update,
    removeCategory,
    softRemoveCategory,
    getAllCategories,
    getAllRemovedCategories
}