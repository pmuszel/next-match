import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string().email("This is not an email address"),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters'
    }),
});


export type LoginSchema = z.infer<typeof loginSchema>