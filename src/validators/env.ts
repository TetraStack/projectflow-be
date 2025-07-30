import { z } from "zod"

const IsDevelopment = process.env.NODE_ENV !== "Production"

const envSchema = z.object({
    APP_NAME: z.string().min(1, { message: "App_Name is required" }),
    PORT: z.string().optional(),
    BASEURL: z.string().min(1, { message: "Base is required" }),
    FRONTEND_URL: z.string().min(1, { message: "FRONTEND_URL is required" }),
    MONGO_URI: z.string().min(1, { message: "MONGO_URI is required" }),
    ACCESS_TOKEN_SECRET: z.string().min(1, { message: "ACCESS_TOKEN_SECRET is required" }),
    ACCESS_TOKEN_SECRET_EXPIRY: z.string().min(1, { message: "ACCESS_TOKEN_SECRET_EXPIRY is required" }),
    REFRESH_TOKEN_SECRET: z.string().min(1, { message: "REFRESH_TOKEN_SECRET is required" }),
    REFRESH_TOKEN_SECRET_EXPIRY: z.string().min(1, { message: "REFRESH_TOKEN_SECRET_EXPIRY is required" }),
    MAILTRAP_HOST_NAME: z.string().min(1, { message: "MAILTRAP_HOST_NAME is required" }),
    MAILTRAP_USERNAME: z.string().min(1, { message: "MAILTRAP_USERNAME is required" }),
    MAILTRAP_PASSWORD: z.string().min(1, { message: "MAILTRAP_PASSWORD is required" }),
    AWS_ACCESSTOKEN: z.string().min(1, { message: "MAILTRAP_PASSWORD is required" }),
    AWS_SECRETKEY: z.string().min(1, { message: "MAILTRAP_PASSWORD is required" }),
    AWS_BUCKETNAME: z.string().min(1, { message: "MAILTRAP_PASSWORD is required" }),
    AWS_BUCKETREGION: z.string().min(1, { message: "MAILTRAP_PASSWORD is required" }),
    NODE_ENV: z.string().min(1, { message: "NODE_ENV is required" }),
    REDIS_URL: z.string().min(1, { message: "REDIS_URL is required" }),
    REDIS_PORT: IsDevelopment ? z.number().optional() : z.number().min(1, { message: "REDIS_PORT is required" }),
    REDIS_USERNAME: IsDevelopment ? z.string().optional() : z.string().min(1, { message: "REDIS_USERNAME is required" }),
    REDIS_PASSWORD: IsDevelopment ? z.string().optional() : z.string().min(1, { message: "REDIS_PASSWORD is required" }),
})
function createENV(env: NodeJS.ProcessEnv) {
    const validationResult = envSchema.safeParse(env)

    if (!validationResult.success) {
        throw new Error(validationResult.error.message)
    }

    return validationResult.data
}

export const env = createENV(process.env)