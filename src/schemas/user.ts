import {z} from 'zod'

export const SignUpSchema = z.object({
    fname : z.string(),
    lname : z.string().nullish(),
    email : z.string().email().toLowerCase(),
    password : z.string().min(6),
})

export const loginSchema = z.object({
    email : z.string().email().toLowerCase(),
    password : z.string().min(6)
})

