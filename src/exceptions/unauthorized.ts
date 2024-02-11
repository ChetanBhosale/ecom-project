import { ErrorCode, HttpException } from "./root";


export class UnauthorizException extends HttpException {
    constructor(message : string, errorCode : ErrorCode){
        super(message,errorCode,404,null)
    }
}