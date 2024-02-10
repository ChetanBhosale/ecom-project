import { Response,Request,NextFunction } from "express"
import { prisma } from "../db/db"
import { SignUpSchema } from "../schemas/user"
import { BadRequestException } from "../exceptions/bad-request"
import { ErrorCode } from "../exceptions/root"

export const signup = async(req:Request,res:Response,next:NextFunction) => {
    SignUpSchema.parse(req.body)
    
    const {email,password,name} = req.body;

    let user = await prisma.User.findFirst({where : {email}})

    if(user){
        new BadRequestException('User already exists!',ErrorCode.USER_ALREADY_EXITS)
    }

    user = await prisma.User.create({
        data : {
            name,
            email,
            password
        }
    })

    res.status(200).json({
        success : true,
        data : user
    })
}