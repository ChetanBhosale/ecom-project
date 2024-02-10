import { Request,Response,NextFunction } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { ZodError } from "zod"
import { BadRequestException } from "./exceptions/bad-request"
import { InternalException } from "./exceptions/internal-exception"


export const errorHandler = (method : Function) => {
    return async (req:Request,res:Response,next:NextFunction) => {
        try {
            await method(req,res,next)
        } catch (error) {
            let exception : HttpException;
            if(error instanceof HttpException){
                exception = error
            } else {
                if(error instanceof ZodError) {
                    exception = new BadRequestException('Unprocessable entity',ErrorCode.UNPROCESSABLE_ENTITY,error) 
                }else{
                    exception = new InternalException('Something Went Wrong!',ErrorCode.INTERNAL_EXCEPTION,error)
                }
            }
            next(exception)
        }
    }
}