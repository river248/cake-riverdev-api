import { env } from '../config/enviroment'
import { jwtHelper } from '../helpers/jwt.helper'
import { HttpStatusCode } from '../utilities/constants'

const isAuth = async (req, res, next) => {

    // Get the token sent from the client side, it is usually best to pass the token in the header
    const tokenFromClient = req.body.token || req.query.token || req.headers['x-access-token']

    if (tokenFromClient) {
        // If token exists
        try {
        // Decrypt the token to see if it is valid or not?
            const decoded = await jwtHelper.verifyToken(tokenFromClient, env.ACCESS_TOKEN_SECRET)

            // If the token is valid, save the decrypted information to the "req" object, for later processing.
            req.jwtDecoded = decoded
            // Allow "req" to go forward to the controller.
            next()
        } catch (error) {
        // If decoding encounters an error: Invalid, expired...etc:

            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                message: 'Unauthorized.'
            })
        }
    } else {
        // Token not found in request
        return res.status(403).send({
            message: 'No token provided.'
        })
    }
}

export const AuthMiddleware = { isAuth }