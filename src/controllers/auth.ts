import { NextFunction,Request,Response } from "express";
import { SignUpSchema, loginSchema } from "../schemas/user";
import { prisma } from "../db/db";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { hashSync } from "bcryptjs";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secreat";
import { MailSender } from "../services/node-email";

export const signup = async(req:Request,res:Response,next:NextFunction) => {
    const data = SignUpSchema.parse(req.body)
    const {email,password,fname,lname} = data

    let User = await prisma.user.findFirst({where: {email : req.body.email}})

    if(User){
        new BadRequestException("User already exists",ErrorCode.USER_ALREADY_EXITS)
    }

    User = await prisma.user.create({
        data : {
            email,
            password : hashSync(password,10),
            fname,
            lname
        } as any
    })

    // await MailSender(email,'Welcome to the system','welcome body')
    // work on mailer sender and found how to make sure it should be sent to geniune user

    // tommorw
        // auth full
        // model 


    res.status(201).json({
        success : true,
        data : User
    })
}



export const login = async(req:Request,res:Response,next : NextFunction) => {
    loginSchema.parse(req.body)
    const {email,password} = req.body

    const user = await prisma.user.findUnique({where : {email}})

    if(!user){
        new BadRequestException('User not found!',ErrorCode.USER_NOT_FOUND) 
    }

    const options = {
        id : user?.id,             
        role : user?.role
    }

    const token = jwt.sign(options,JWT_SECRET!)

    res.cookie("token",token,{ expires: new Date(Date.now() + 900000),   httpOnly: true }).status(201).json({
        success : true,
        data : user,
        token : token
    })
    
}