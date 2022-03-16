import { CakeModel } from '../models/cake.model'
import { TransactionModel } from '../models/transaction.model'

const createNew = async (data) => {
    try {
        let listNewProduct = []
        let arr = data.listProducts
        for (let item in arr) {
            let product = await CakeModel.getDetailedCake(arr[item]._id)
            if (product) {
                product = {
                    _id: product._id.toString(),
                    name: product.name,
                    quantity: arr[item].quantity,
                    price: arr[item].price
                }
                listNewProduct.push(product)
            }
        }
        const validData = { ...data, listProducts: [...listNewProduct]}
        const result = await TransactionModel.createNew(validData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const TransactionService = {
    createNew,

}