import nodemailer from 'nodemailer'
import { InternalException } from '../exceptions/internal-exception'
import { ErrorCode } from '../exceptions/root'


let transport = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'ecomassist4u@gmail.com',
        pass : '1234@Chetan'
    }
})

export const MailSender = async(email:string,subject:string,body:string) => {
    let mailOption = {
        from : 'ecomassist4u@gmail.com',
        to : email,
        subject : subject,
        text : body
    }

    transport.sendMail(mailOption,(error) => {
        if(error){
           return new InternalException('Email sender Error',ErrorCode.INTERNAL_EXCEPTION,error)
        }else{
            console.log('email sent!')
        }
        
    })
}