import { ApiError } from "@/utils/apiError"
import { RequestHandler } from "express"
import * as z from "zod"

export const validate = (schema: z.Schema): RequestHandler => {
    return async (req, _, next) => {
        try {
            await schema.parse({ ...req.body })
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new ApiError(422, error.issues[0].message));
            } else {
                next(new ApiError(422, error as string));
            }

        }
    }
}
