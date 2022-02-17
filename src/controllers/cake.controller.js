import { CakeService } from '../services/cake.service'
import { HttpStatusCode } from '../utils/constants'

const createNew = async (req, res) => {
    try {
        const result = await CakeService.createNew(req.body)
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
        const result = await CakeService.update(id, req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getCakes = async (req, res) => {
    try {
        const { page } = req.query
        const result = await CakeService.getCakes(page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getDetailedCake = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CakeService.getDetailedCake(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getCategoryCake = async (req, res) => {
    try {
        const { categoryID, page } = req.query
        const result = await CakeService.getCategoryCake(categoryID, page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const removeCake = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CakeService.removeCake(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const removeCategoryCakes = async (req, res) => {
    try {
        const { categoryID } = req.params
        const result = await CakeService.removeCategoryCakes(categoryID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getSoftRemovedCakes = async (req, res) => {
    try {
        const { page } = req.query
        const result = await CakeService.getSoftRemovedCakes(page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getSoftRemovedCategoryCakes = async (req, res) => {
    try {
        const { categoryID, page } = req.query
        const result = await CakeService.getSoftRemovedCategoryCakes(categoryID, page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const softRemoveCake = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CakeService.softRemoveCake(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const softRemoveCategoryCakes = async (req, res) => {
    try {
        const { categoryID } = req.params
        const result = await CakeService.softRemoveCategoryCakes(categoryID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const CakeController = {
    createNew,
    update,
    getCakes,
    getDetailedCake,
    getCategoryCake,
    removeCake,
    removeCategoryCakes,
    getSoftRemovedCakes,
    getSoftRemovedCategoryCakes,
    softRemoveCategoryCakes,
    softRemoveCake
}