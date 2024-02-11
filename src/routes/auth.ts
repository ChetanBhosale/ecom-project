import { Router } from "express";
import { errorHandler } from "../error-handler";
import { signup } from "../controllers/auth";
const authRouter : Router = Router()

authRouter.post('/signup',errorHandler(signup))

export default authRouter;