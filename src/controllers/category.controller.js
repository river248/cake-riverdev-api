import { CategoryService } from '../services/category.service'
import { HttpStatusCode } from '../utils/constants'

const getAllCategories = async (req, res) => {
    try {
        const result = await CategoryService.getAllCategories()

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const CategoryController = {
    getAllCategories,
    
}