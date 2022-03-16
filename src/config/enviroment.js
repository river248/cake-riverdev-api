require('dotenv').config()

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN: process.env.MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS
}