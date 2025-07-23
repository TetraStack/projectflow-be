import { env } from "@/validators/env";
import { decodeUserType } from "@/types/express";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const isAuth = asyncHandler((req: Request, res: Response, next: NextFunction) => {

    let { accessToken } = req.cookies

    if (!accessToken) {
        accessToken = req.headers.authorization?.split("Bearer ")[1]
    }

    if (!accessToken) {
        return next(new ApiError(403, "Invalid Request"))
    }

    const { _id, email, username } = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as decodeUserType

    req.user = {
        _id: _id, email: email, username: username
    }

    next()

})