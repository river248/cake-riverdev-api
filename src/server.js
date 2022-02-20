import express from 'express'
import cors from 'cors'
import { connectDB } from './config/mongodb'
import { apiV1 } from './routes/v1'


connectDB()
.then(() => console.log('Connected successfully to database server!'))
.then(() => bootServer())
.catch(error => {
    console.error(error)
    process.exit(1)
})

const bootServer = () => {
    
    const app = express()
    
    app.use(
        cors({
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            origin: [
                'https://cake-riverdev-web.herokuapp.com',
                'http://localhost:3000',
                'https://cake-riverdev-web.web.app',
                'http://localhost:8080']
        })
    )
    // Enable req.body data
    app.use(express.json())

    app.use(express.urlencoded({ extended: true }))

    // Use APIs v1
    app.use('/v1', apiV1)

    app.listen(process.env.PORT, () => {
        console.log(`Hello Riverdev, I'm running at :${process.env.APP_PORT}/`)
    })

}
