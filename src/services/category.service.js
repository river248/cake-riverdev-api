import firebaseApp from '../config/firebaseConfig'
import { categoryModel } from '../models/category.model'
import { ref, getDownloadURL, getStorage } from 'firebase/storage'
import { HttpStatusCode } from '../utils/constants'

const getAllCategories = async () => {
    try {
        firebaseApp()
        const categories = await categoryModel.getAllCategories()
        const storage = getStorage()
        const result = categories.map((category) => {
            const gsReference = ref(storage, `gs://bucket/${category.thumbnail}`)
            console.log(gsReference)
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const CategoryService = {
    getAllCategories,
    
}