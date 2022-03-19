import firebaseApp from '../config/firebaseConfig'
import { mailHelper } from '../helpers/mail.helper'
import { CakeModel } from '../models/cake.model'
import { TransactionModel } from '../models/transaction.model'
import { getStorage, ref, getDownloadURL } from "firebase/storage"

const createNew = async (data) => {
    try {
        firebaseApp()
        const storage = getStorage()
        let listNewProduct = []
        let arr = data.listProducts
        for (let item in arr) {
            let product = await CakeModel.getDetailedCake(arr[item]._id)
            let imageUrl = ''
            if (product) {
                await getDownloadURL(ref(storage, product.thumbnail))
                .then((url) => imageUrl = url)
                .catch((error) => {
                    throw new Error(error)
                });
                product = {
                    _id: product._id.toString(),
                    name: product.name,
                    thumbnail: imageUrl,
                    quantity: arr[item].quantity,
                    price: arr[item].price
                }
                listNewProduct.push(product)
            }
        }
        const validData = { ...data, listProducts: [...listNewProduct]}
        const result = await TransactionModel.createNew(validData)
        if (result && validData.customer.email)
            await mailHelper.sendMail(validData.customer.email, validData, null, null)
        return result.insertedId
    } catch (error) {
        throw new Error(error)
    }
}

export const TransactionService = {
    createNew,

}