import express, { Request, Response } from 'express'
import { connectToDatabase } from './db'
import * as dotenv from "dotenv";
import UserConttroller from './controllers/UserController';
import AuthController from './controllers/AuthController';
import cors from 'cors'

dotenv.config()
const app = express()
app.use(express.json())
const port = process.env.PORT

const options: cors.CorsOptions = {
    methods: "GET,OPTIONS,POST,PUT,DELETE",
    origin: "*",
    credentials: true,
    allowedHeaders: "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
}

app.use(cors(options))

connectToDatabase().then(() => {

    //==========================User============================

    app.post('/register/psychologist', UserConttroller.register)


    //=============================AUTH================================

    app.post('/auth/login', AuthController.login)

    //==============================SERVER=============================

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            msg: 'everything is on...'
        })
    })

    app.listen(port, () => {
        return console.log(`Server is listening on ${port}`)
    })

}).catch((e: Error) => {
    console.log('Database connection failed...')
})