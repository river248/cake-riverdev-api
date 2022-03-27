import { UserService } from '../services/user.service'
import { HttpStatusCode } from '../utils/constants'

const register = async (req, res) => {
    try {

        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        await UserService.register(data)

        res.status(HttpStatusCode.OK).json({ message: 'Register successfully! Please activate your email to start.' })

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const verifyEmail = async (req, res) => {
    try {

        const { verify } = req.body

        const result = await UserService.verifyEmail(verify)

        if (result)
            return res.redirect('https://cake-riverdev-web.web.app/account/sign-in')
        return res.status(HttpStatusCode.OK).json({
            message: 'Already verified!'
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password
        }

        const result = await UserService.login(data)
        if (result)
            generalReturn(res, result.accessToken, result.refreshToken)
        else if (result === null) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Email does not exist!'
            })
        } else {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Username or Password is Wrong!'
            })
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const refreshToken = async (req, res) => {

    try {
        const token = req.cookies.refreshToken
        if (token) {
            const accessToken = await UserService.refreshToken(token)
            return res.status(200).json({ accessToken })
        } else {
            return res.status(HttpStatusCode.FORBIDDEN).send({
                message: 'No token provided.'
            })
        }
    } catch (error) {
        res.clearCookie('refreshToken', { path: '/v1/user/refresh-token' })
        res.status(HttpStatusCode.FORBIDDEN).json({
            message: 'Invalid refresh token.'
        })
    }
}

const socialLogin = async (req, res) => {
    try {

        const { social } = req.params
        
        let data = null
        if (social === 'google') {
            const { tokenId } = req.body
            data = await UserService.googleLogin(tokenId)
        } else {
            const { accessToken, userID } = req.body
            data = await UserService.facebookLogin(accessToken, userID)
        }

        if (data)
            generalReturn(res, data.accessToken, data.refreshToken)
        else if (data === null)
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Email verification failed!' })
        else
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Incorrect password!' })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const logout = (req, res) => {

    try {
        res.clearCookie('refreshToken', { path: '/v1/user/refresh-token' })
        res.status(HttpStatusCode.OK).json({ message: 'Logged out!' })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: error.message })
    }
}

const generalReturn = (res, accessToken, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/v1/user/refresh-token',
        maxAge: 7*24*60*60*1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production' ? true : false
    })
    return res.status(HttpStatusCode.OK).json({ accessToken })
}

const getUserInfo = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const result = await UserService.getUserInfo(_id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const { page } = req.params
        const result = await UserService.getAllUsers(page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getLoveCakes = async (req, res) => {
    try {
        const { page } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserService.getLoveCakes(_id, page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const updateLoveCake = async (req, res) => {
    try {
        const { cakeID } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserService.updateLoveCake(_id, cakeID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const loveStatus = async (req, res) => {
    try {
        const { cakeID } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserService.loveStatus(_id, cakeID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const { data } = req.body
        const { type } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserService.update(_id, data, type)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.HttpStatusCode(INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const UserController = {
    register,
    verifyEmail,
    login,
    refreshToken,
    socialLogin,
    logout,
    getUserInfo,
    getAllUsers,
    getLoveCakes,
    updateLoveCake,
    loveStatus,
    update
}