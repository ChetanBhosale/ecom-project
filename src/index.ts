import express,{ Express } from "express";
import { errorMiddleware } from "./middlewares/errors";
import {PORT} from './secreat'
import session from 'express-session'
import cookieParser from 'cookie-parser'
const app : Express = express()

app.use(cookieParser())
app.use(express.json())
app.use(session({
    secret : process.env.SESSION_KEY!,
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false},
}))

export interface MySession extends session.Session {
  otps: Array<{
    email : string,
    value: string;
    expiresAt: number;
  }>;
}




import root from './routes/root'

app.use('/api',root)


app.use(errorMiddleware)

app.listen(PORT,() => {
    console.log(`App Working on PORT ${PORT}`)
})
