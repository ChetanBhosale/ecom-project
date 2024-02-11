import { Router,Request,Response } from "express";
import { errorHandler } from "../error-handler";
import { changePassword, forgotPassword, login, sendOtp, signup } from "../controllers/auth";
import { adminAuthorization, userAuthorization } from "../middlewares/authorization";
const authRouter : Router = Router()

authRouter.post('/signup',errorHandler(signup))
authRouter.post('/otp',errorHandler(sendOtp))
authRouter.post('/login',errorHandler(login))
authRouter.put('/change-password',errorHandler(changePassword))
authRouter.put('/forgot-password',errorHandler(forgotPassword))


authRouter.get('/test',[userAuthorization,adminAuthorization],(req:Request,res:Response) => {
    res.json({message : 'working'})
})
export default authRouter;