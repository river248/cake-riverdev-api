import { CakeModel } from '../models/cake.model'
import { titleCase } from '../utils/formatData'

const createNew = async (data) => {
    try {
        const checkExist = await CakeModel.getProductByName(data.name)
        if (checkExist)
            return null
        const validateData = { ...data, name: titleCase(data.name)}
        const result = await CakeModel.createNew(validateData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        let updatedData = {}
        if (data.name) {
            updatedData = {
                ...data,
                name: titleCase(data.name),
                updatedAt: Date.now()
            }
        }
        const result = await CakeModel.update(id, updatedData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getCakes = async (sortBy, value, page) => {
    try {
        const result = await CakeModel.getCakes(sortBy, value*1, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getDetailedCake = async (id) => {
    try {
        const result = await CakeModel.getDetailedCake(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getCategoryCakes = async (categoryID, sortBy, value, page) => {
    try {
        const result = await CakeModel.getCategoryCakes(categoryID, sortBy, value*1, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const searchBy = async (key, page) => {
    try {
        const result = await CakeModel.searchBy(key, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeCake = async (id) => {
    try {
        const result = await CakeModel.removeCake(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeCategoryCakes = async (categoryID) => {
    try {
        const result = await CakeModel.removeCategoryCakes(categoryID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getSoftRemovedCakes = async (page) => {
    try {
        const result = await CakeModel.getSoftRemovedCakes(page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getSoftRemovedCategoryCakes = async (categoryID, page) => {
    try {
        const result = await CakeModel.getSoftRemovedCategoryCakes(categoryID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const softRemoveCake = async (id) => {
    try {
        const result = await CakeModel.update(id, { _destroy: true })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const softRemoveCategoryCakes = async (categoryID) => {
    try {
        const result = await CakeModel.softRemoveCategoryCakes(categoryID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const CakeService = {
    createNew,
    update,
    getCakes,
    getDetailedCake,
    getCategoryCakes,
    searchBy,
    removeCake,
    removeCategoryCakes,
    softRemoveCake,
    softRemoveCategoryCakes,
    getSoftRemovedCakes,
    getSoftRemovedCategoryCakes
}