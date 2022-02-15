import { CategoryService } from '../services/category.service'
import { HttpStatusCode } from '../utils/constants'

const createNew = async (req, res) => {
    try {
        const result = await CategoryService.createNew(req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CategoryService.update(id, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const removeCategory = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CategoryService.removeCategory(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const softRemoveCategory = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CategoryService.softRemoveCategory(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

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

const getAllRemovedCategories = async (req, res) => {
    try {
        const result = await CategoryService.getAllRemovedCategories()

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const CategoryController = {
    createNew,
    update,
    removeCategory,
    softRemoveCategory,
    getAllCategories,
    getAllRemovedCategories
}