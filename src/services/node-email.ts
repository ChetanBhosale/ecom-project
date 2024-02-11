import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";

const nodemailer = require("nodemailer");



const mailSender = async (email:string, title:string, body:string) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'StudyNotion || Horror',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            return info;
    }
    catch(error) {
        new BadRequestException('Server Error', ErrorCode.INTERNAL_EXCEPTION)
    }
}




export default mailSender