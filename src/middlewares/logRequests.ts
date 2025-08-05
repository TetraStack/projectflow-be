import { logger } from "@/logger";
import { NextFunction, Request, Response } from "express"

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        })
    })

    next()
}