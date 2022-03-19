import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { env } from '../config/enviroment'

const OAuth2 = google.auth.OAuth2

const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const OAuth2Client = new OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, REDIRECT_URL)
OAuth2Client.setCredentials({ refresh_token: env.MAILING_SERVICE_REFRESH_TOKEN })

const sendMail = async (toEmail, transaction, url, text) => {

    const accessToken = await OAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: env.SENDER_EMAIL_ADDRESS,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            refreshToken: env.MAILING_SERVICE_REFRESH_TOKEN,
            accessToken: accessToken
        }
    })

    let mailOptions = {}

    if (!url && !text) {

        const products = transaction.listProducts
        let className = 'border: 1px solid #f08632; color: #f08632; border-collapse: collapse'
        let className2 = 'border: 1px solid white; color: white; border-collapse: collapse'
        let shoppingCartInfo = `<table width='90%' style="${className}; box-sizing: content-box" text-align='center'>`
        let totalPrice = 0
        shoppingCartInfo += `<tr style="text-align: center; background-color: #f08632">
                            <th style="${className2}; border-left: 0" width='10%'>No.</th>
                            <th style="${className2}" width='15%'>Image</th>
                            <th style="${className2}" width='30%'>Name</th>
                            <th style="${className2}" width='10%'>Quantity</th>
                            <th style="${className2}" width='15%'>Unit Price</th>
                            <th style="${className2}; border-right: 0">Amount</th></tr>`
        for (let item in products) {
          shoppingCartInfo += `<tr style="text-align: center;${className}"><td>` + (item*1+1) + "</td>"
                            + `<td style="${className}"><img width='100px' src='` + products[item].thumbnail + `' alt=''/></td>`
                            + `<td style="${className}">` + products[item].name + `</td>`
                            + `<td style="${className}">` + products[item].quantity + `</td>`
                            +  `<td style="${className}">$ ` + products[item].price + `</td>`
                            + `<td style="${className}">$ ` + products[item].quantity*products[item].price + `</td></tr>`
            totalPrice += products[item].quantity*products[item].price
        }
        shoppingCartInfo += `<tr style='text-align: center; font-weight: bold;'>
                            <td colspan='3' style="${className}">Total</td>
                            <td colspan='3' style="${className}">$ `+totalPrice+"</td></tr></table>"
        shoppingCartInfo += `<div style="margin-top: 30px;">
                            <span style="display: block;"><b>Customer:</b> ${transaction.customer.name}</span>
                            <span style="display: block;"><b>Phone:</b> ${transaction.customer.phone}</span>
                            <span style="display: block;"><b>Adress:</b> ${transaction.customer.address}</span></div>`
    
        mailOptions = {
            from: `Cake Shop <${env.SENDER_EMAIL_ADDRESS}>`,
            to: toEmail,
            subject: 'Place Order',
            html: shoppingCartInfo
        }
    } else if (url) {
        mailOptions = {
            from: `Cake Shop <${env.SENDER_EMAIL_ADDRESS}>`,
            to: toEmail,
            subject: 'Activate Account',
            html: `
            <form method="POST" action=${url} style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;text-align:center;">
            <h2 style="text-align: center; text-transform: uppercase;color: #f08632;">Welcome to Cake Shop!</h2>
            <p>
                Please click the below button to verify account!
            </p>
            <input type="text" name="verify" style="display: none" readOnly value="${text}"></input>
            <input type="submit" value="verify" style="background: #f08632; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;border-radius:0.5rem;font-weight: bold;box-shadow:0 3px 6px #fa62ff;text-transform: uppercase;cursor: pointer; outline: none;border: none"></input>
        
          </form>`
        }
    } else {
        mailOptions = {
            from: `Cake Shop <${env.SENDER_EMAIL_ADDRESS}>`,
            to: toEmail,
            subject: 'New Password',
            html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;text-align:center;">
            <h2 style="text-align: center; text-transform: uppercase;color: #f08632;">Welcome to Cake Shop!</h2>
            <p>
                Your new password is: ${text}
            </p>
        
            </div>`
        }
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log('Error: ', err)
        else
            return info
        transporter.close()
    })
}

export const mailHelper = { sendMail }