import { ApiError } from "@/utils/apiError";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    res.status(500).json({
        success: false,
        message: err.message,
        errors: [],
    });
};

