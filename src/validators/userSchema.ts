import * as z from "zod";

export const registerUserSchema = z.object({
    username: z.string({ required_error: "username is required" }).min(1, "username can't be empty").max(15, "length of username can't be more 10"),
    email: z.string({ required_error: "email is required" }).email(),
    fullName: z.string({ required_error: "FullName is required" }),
    password: z.string({ required_error: "Password is required" }).min(6, "length of Password can't be lessthan 6").max(16, "length of Password can't be more 16"),
});

export const verifyEmailSchema = z.object({
    id: z.string({ required_error: "id is required" }).min(1, "id can't be empty"),
    token: z.string({ required_error: "token is required" }).min(1, "token can't be empty")
})

export const loginSchema = z.object({
    email: z.string({ required_error: "email is required" }).email(),
    password: z.string({ required_error: "Password is required" })
})

export const resendVerificationSchema = z.object({
    email: z.string({ required_error: "email is required" }).email(),
})

export const resetPasswordSchema = z.object({
    id: z.string({ required_error: "id is required" }).min(1, "id can't be empty"),
    token: z.string({ required_error: "token is required" }).min(1, "token can't be empty"),
    password: z.string({ required_error: "Password is required" })
})

export const changePasswordSchema = z.object({
    password: z.string({ required_error: "Password is required" }).min(6, "length of Password can't be lessthan 6").max(16, "length of Password can't be more 16"),
})

