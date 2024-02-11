import express,{ Express } from "express";
import { errorMiddleware } from "./middlewares/errors";
import {PORT} from './secreat'
import session from 'express-session'
const app : Express = express()


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
import { Session } from "inspector";

app.use('/api',root)


app.use(errorMiddleware)

app.listen(PORT,() => {
    console.log(`App Working on PORT ${PORT}`)
})
