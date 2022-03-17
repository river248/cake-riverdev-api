import { sign, verify } from 'jsonwebtoken'

const generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
        const userData = {
            _id: user._id,
            isAdmin: user.isAdmin
        }
        // Thực hiện ký và tạo token
        sign(
            { data: userData },
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife
            },
            (error, token) => {
                if (error) {
                    return reject(error)
                }
                resolve(token)
            })
    })
}

const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error)
            }
            resolve(decoded)
        })
    })
}

export const jwtHelper = {
    generateToken,
    verifyToken
}