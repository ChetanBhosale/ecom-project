import {z} from 'zod'

export const SignUpSchema = z.object({
    name : z.string(),
    email : z.string().email().toLowerCase(),
    password : z.string().min(6),
})