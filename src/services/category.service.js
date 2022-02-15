import { categoryModel } from '../models/category.model'
import { titleCase } from '../utils/formatData'

const createNew = async (data) => {
    try {
        const validateData = {...data, name: titleCase(data.name)}
        const result = await categoryModel.createNew(validateData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        let updateData = {}
        if (data.name) {
            updateData = {
                ...data,
                name: titleCase(data.name),
                updatedAt: Date.now()
            }
        }
        const result = await categoryModel.update(id, updateData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeCategory = async (id) => {
    try {
        const result = await categoryModel.removeCategory(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const softRemoveCategory = async (id) => {
    try {
        const result = await categoryModel.update(id, { _destroy: true })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllCategories = async () => {
    try {
        const result = await categoryModel.getAllCategories()

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllRemovedCategories = async () => {
    try {
        const result = await categoryModel.getAllRemovedCategories()

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