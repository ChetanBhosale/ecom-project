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

export const changePasswordSchema = z.object({
     email : z.string().email().toLowerCase(),
     oldPassword : z.string().min(6),
     newPassword: z.string().min(6),
     otp : z.string().min(6)
})

export const forgotPasswordSchema = z.object({
    email : z.string().email().toLowerCase(),
    newPassword : z.string().min(6),
    otp : z.string().min(6)
})