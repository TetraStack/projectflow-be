import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";

export const healthCheck = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json({ message: "Up & Running" })
})