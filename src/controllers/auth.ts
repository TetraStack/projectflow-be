import { User } from "@/models/user";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {

    const { username, email, fullname, password } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) throw new ApiError(400, "Username and email are already used")

    const createdUser = await User.create({
        username, email, fullname, password
    })

    if (!createdUser) throw new ApiError(500, "Something went wrong.")

    return res.status(200).json(new ApiResponse(200, "Account has beeen created", {
        profile: {
            username,
            email,
            fullname
        }
    }))
})

export const getUser = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to getuser"))
})

export const loginUser = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to Loginuser"))
})

export const logoutUser = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to logoutUser"))
})

export const verifyUser = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to verifyUser"))
})

export const resendVerification = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to resendVerification"))
})

export const resetPassword = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to resetPassword"))
})

export const refreshAccessToken = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to refreshAccessToken"))
})

export const forgetPassword = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to forgetPassword"))
})

export const changepassword = asyncHandler((req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "Reached to changepassword"))
})

