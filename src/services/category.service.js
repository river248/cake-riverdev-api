import { categoryModel } from '../models/category.model'
import { HttpStatusCode } from '../utils/constants'

const getAllCategories = async (req, res) => {
    try {
        const result = await categoryModel.getAllCategories()

        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const CategoryService = {
    getAllCategories,
    
}