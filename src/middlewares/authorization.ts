import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secreat";
import { UnauthorizException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { prisma } from "../db/db";
import { InternalException } from "../exceptions/internal-exception";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string,
    email : string,
    role : string
  };
}

export const userAuthorization = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || (req.headers.authorization?.split(" ").splice(1, 1).toString());

    if (!token) {
       next(  new UnauthorizException('User is unauthorized', ErrorCode.UNAUTHORIZATION))
    }

    const payload = jwt.verify(token, JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      next(  new UnauthorizException('User is unauthorized', ErrorCode.UNAUTHORIZATION))
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(new InternalException('Something went wrong!', ErrorCode.UNAUTHORIZATION,error))
  }
};


export const adminAuthorization = (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
        const user = req.user!
        if(user.role === "ADMIN"){
            next()
        }else {
             next(  new UnauthorizException('User is unauthorized', ErrorCode.UNAUTHORIZATION))
        }

    } catch (error) {
        next(new InternalException('Something went wrong!', ErrorCode.UNAUTHORIZATION,error))
    }
}

