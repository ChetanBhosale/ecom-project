import express,{ Express } from "express";
const app : Express = express()
import {PORT} from './secreat'
import { errorMiddleware } from "./middlewares/errors";



app.use(express.json())




import root from './routes/root'

app.use('/api',root)


app.use(errorMiddleware)

app.listen(PORT,() => {
    console.log(`App Working on PORT ${PORT}`)
})