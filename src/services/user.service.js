import bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import fetch from 'node-fetch'

import { env } from '../config/enviroment'
import { jwtHelper } from '../helpers/jwt.helper'
import { mailHelper } from '../helpers/mail.helper'
import { UserModel } from '../models/user.model'

const CLIENT_URL = process.env.NODE_ENV === 'production' ? 'https://cake-riverdev-api.herokuapp.com' : 'http://localhost:8080'
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

const register = async (data) => {
    try {
        const passwordHash = await bcrypt.hash(data.password, 12)

        const newUser = {
            username: data.name,
            email: data.email,
            password: passwordHash
        }

        const activeToken = await jwtHelper.createActiveToken(newUser, env.ACTIVE_TOKEN_SECRET, env.ACTIVE_TOKEN_LIFE)
        const url = `${CLIENT_URL}/v1/user/verify-email`

        await mailHelper.sendMail(newUser.email, null, url, activeToken)
    } catch (error) {
        throw new Error(error)
    }
}

const verifyEmail = async (verify) => {
    try {
        const decode = await jwtHelper.verifyToken(verify, env.ACTIVE_TOKEN_SECRET)
        const userData = decode.data
        const checkUser = await UserModel.getUserByEmail(userData.email)
        let result = null
        if (!checkUser)
            result = await UserModel.createNew(userData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getUserByEmail = async (email) => {
   try {
       const result = await UserModel.getUserByEmail(email)
       return result
   } catch (error) {
       throw new Error(error)
   } 
}

const login = async (data) => {
    try {
        const userData = await UserModel.login(data)
        if (userData !== null && userData !== undefined) {
            try {
                return await generalReturn(userData)
            } catch (error) {
                throw new Error(error)
            }
        }

        return userData
    } catch (error) {
        throw new Error(error)
    }
}

const refreshToken = async (token) => {

    try {
        const decoded = await jwtHelper.verifyToken(token, env.REFRESH_TOKEN_SECRET)

        const userData = decoded.data

        const accessToken = await jwtHelper.generateToken(userData, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)

        return accessToken

    } catch (error) {
        throw new Error(error)
    }

}

const googleLogin = async (tokenId) => {
    
    try {
        const verify = await client.verifyIdToken({ idToken: tokenId, audience: env.GOOGLE_CLIENT_ID })

        let { email_verified, email, name, picture } = verify.payload
    
        const password = email + env.GOOGLE_SECRET
        
        if (!email_verified) return null
        
        return await generalSocial(email, password, picture, name)
        
    } catch (error) {
        throw new Error(error)
    }
}

const facebookLogin = async (accessToken, userID) => {
    try {
        const URL = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`

        const verify = await fetch(URL)
            .then((res) => res.json())
            .then((res) => res)
        const { email, name, picture } = verify

        const password = email + env.FACEBOOK_SECRET

        return await generalSocial(email, password, picture.data.url, name)
    } catch (error) {
        throw new Error(error)
    }
}

const generalSocial = async (email, password, picture, name) => {
    let data = { email: email, password: password }
    const userData = await login(data) // return data/null/undefined

    if (userData !== null && userData !== undefined) // if it has data
        return userData
    if (userData === null) {
        const passwordHash = await bcrypt.hash(password, 12)
        data = { username: name, email: email, password: passwordHash, avatar: picture }
        try {
            await UserModel.createNew(data)
            let userInfo = await getUserByEmail(email)
            return await generalReturn(userInfo)
        } catch (error) {
            throw new Error(error)
        }
    }
    return userData //return undefined
}

const generalReturn = async (userData) => {
    try {
        const accessToken = await jwtHelper.generateToken(userData, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)
        const refreshToken = await jwtHelper.generateToken(userData, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_LIFE)
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error(error)
    }
}

const getUserInfo = async (id) => {
    try {
        const result = await UserModel.getUserInfo(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllUsers = async (page) => {
    try {
        const result = await UserModel.getAllUsers(page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getLoveCakes = async (userID, page) => {
    try {
        const result = await UserModel.getLoveCakes(userID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const updateLoveCake = async (userID, cakeID) => {
    try {
        const result = await UserModel.updateLoveCake(userID, cakeID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const loveStatus = async (userID, cakeID) => {
    try {
        const result = await UserModel.loveStatus(userID, cakeID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data, type) => {
    try {
        let updateData = {}
        if (type === 'update')
            updateData = {
                ...data,
                updateAt: Date.now()
            }
        else
            updateData = {
                _destroy: true,
                updateAt: Date.now()
            }
        const result = await UserModel.update(id, data)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const UserService = {
    register,
    verifyEmail,
    getUserByEmail,
    login,
    refreshToken,
    googleLogin,
    facebookLogin,
    getUserInfo,
    getAllUsers,
    getLoveCakes,
    updateLoveCake,
    loveStatus,
    update
}