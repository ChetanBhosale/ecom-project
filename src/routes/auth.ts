import { Router } from "express";
import { errorHandler } from "../error-handler";
import { login, sendOtp, signup } from "../controllers/auth";
const authRouter : Router = Router()

authRouter.post('/signup',errorHandler(signup))
authRouter.post('/otp',errorHandler(sendOtp))
authRouter.post('/login',errorHandler(login))

export default authRouter;