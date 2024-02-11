import {z} from 'zod'

export const SignUpSchema = z.object({
    email : z.string().email().toLowerCase(),
    password : z.string().min(6),
    otp : z.string().min(6),
})

export const loginSchema = z.object({
    email : z.string().email().toLowerCase(),
    password : z.string().min(6)
})


export const otpEmailValidaton = z.object({
    email : z.string().email().toLowerCase(),
})