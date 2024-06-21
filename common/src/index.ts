import z from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export type SignupSchema = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type SigninSchema = z.infer<typeof signinSchema>;

export const createPostSchema = z.object({
    title: z.string(),
    content: z.string()
})

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})

export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
