import * as z from "zod";

export const registerUserSchema = z.object({
    username: z.string({ required_error: "username is required" }).min(1, "username can't be empty").max(15, "length of username can't be more 10"),
    email: z.string({ required_error: "email is required" }).email(),
    fullName: z.string({ required_error: "FullName is required" }),
    password: z.string({ required_error: "Password is required" }).min(6, "length of Password can't be lessthan 6").max(16, "length of Password can't be more 16"),
});