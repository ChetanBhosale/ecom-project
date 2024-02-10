import { Router } from "express";
const rootRouter : Router = Router()


import authRouter from './auth'


rootRouter.use('/auth',authRouter)




export default Router;