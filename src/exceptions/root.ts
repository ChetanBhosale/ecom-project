

export class HttpException extends Error {
    message : string;
    errorCode : any;
    statusCode : number;
    errors : any;

    constructor (message : string,errorCode : any, statusCode : number , error : any){
        super(message)
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = error;
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXITS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORIZATION = 4001,
    OTP_IS_INCORRECT = 4002
}