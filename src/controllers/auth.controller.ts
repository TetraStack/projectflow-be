import { env } from "@/validators/env";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { uploadTos3 } from "@/utils/awsHelper";
import { Request, Response } from "express";
import crypto from "crypto";
import { emailVerificationMailGenContent, forgotPasswordMailGenContent, sendMail } from "@/utils/mail";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { decodeUserType } from "@/types/express";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, fullName, password } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) throw new ApiError(400, "Username and email are already used")

    let avatar = undefined

    if (req.file) {
        const { response, link } = await uploadTos3(req.file!.filename, req.file!.path)

        if (!response.VersionId) {
            throw new ApiError(500, "Something went wrong while uploading file.")
        }

        avatar = {
            url: link, filename: req.file!.filename
        }
    }

    //token for verfication mail
    const token = crypto.randomBytes(32).toString("hex")

    const createdUser = await User.create({
        username, email, fullName, password, avatar: avatar, emailVerificationToken: token
    })

    if (!createdUser) throw new ApiError(500, "Something went wrong.")

    const verificationLink = `${env.BASEURL}:${env.PORT}/verify.html?id=${createdUser._id}&token=${token}`;

    const mailContent = emailVerificationMailGenContent(createdUser.fullName, verificationLink)

    sendMail({ email, subject: `Welcome to ${env.APP_NAME} app`, mailGenContent: mailContent })

    return res.status(200).json(new ApiResponse(200, "Account has beeen created.Check your Inbox", {
        profile: {
            username,
            email,
            fullName
        }
    }))
})

export const getUser = asyncHandler(async (req: Request, res: Response) => {

    const user = await User.findOne({ _id: req.user!._id })

    if (!user) {
        throw new ApiError(401, "User not found")
    }

    return res.status(200).json(new ApiResponse(200, "user is fetched", {
        profile: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
        }
    }))
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) throw new ApiError(404, "User not found")

    if (!user.isEmailVerified) throw new ApiError(400, "Please verify email before login")

    const isValid = await user.isPasswordCorrect(password)
    if (!isValid) {
        throw new ApiError(400, "Credential are wrong")
    }

    const accessToken = user.generateAccesssTokens()
    const refreshToken = user.generateRefreshTokens()

    user.refreshToken = refreshToken
    await user.save()

    return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(200, "Logged in successFully", {
        profile: {
            email,
            username: user.username,
            fullName: user.fullName,
            isEmailVerified: user.isEmailVerified
        },
        tokens: {
            accessToken, refreshToken
        }
    }))
})

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {

    const _id = req.user?._id

    const user = await User.findOneAndUpdate({ _id }, {
        refreshToken: ""
    })

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json(new ApiResponse(200, "User Logged out successFully"))
})

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    let { id, token } = req.body

    id = new mongoose.Types.ObjectId(id);

    const user = await User.findOne({ _id: id })

    if (!user) throw new ApiError(404, "Invalid User")

    if (user.emailVerificationToken !== token) {
        throw new ApiError(404, "Invalid token")
    }

    user.isEmailVerified = true
    user.emailVerificationToken = ""
    await user.save()

    return res.status(200).json(new ApiResponse(200, "Email is verified"))
})

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body

    const token = await crypto.randomBytes(32).toString("hex")

    const user = await User.findOne({ email })

    if (user?.isEmailVerified) {
        throw new ApiError(400, "Account is already verified")
    }

    const updatedUser = await User.findOneAndUpdate({ email }, { emailVerificationToken: token }, {
        new: true
    })

    if (!updatedUser) {
        throw new ApiError(400, "No user Found")
    }

    const verificationLink = `${env.BASEURL}:${env.PORT}/verify.html?id=${updatedUser._id}&token=${token}`;

    const mailContent = emailVerificationMailGenContent(updatedUser.fullName, verificationLink)

    sendMail({ email, subject: `Welcome to ${env.APP_NAME} app`, mailGenContent: mailContent })

    return res.status(200).json(new ApiResponse(200, "Check your Inbox"))
})

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    let { refreshToken } = req.cookies || req.body

    if (!refreshToken) {
        refreshToken = req.body.refreshToken
    }

    if (!refreshToken) throw new ApiError(403, "Invalid request")

    const decoded = await jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as decodeUserType

    if (!decoded) throw new ApiError(400, "Invalid tokens")

    const user = await User.findById({ _id: decoded._id })

    if (!user) throw new ApiError(404, "user not found")

    const newRefreshToken = user.generateRefreshTokens()
    const newAccesssTokens = user.generateAccesssTokens()

    user.refreshToken = newRefreshToken
    await user.save()

    return res.status(200).cookie("accessToken", newAccesssTokens).cookie("refreshToken", newRefreshToken).json(new ApiResponse(200, "Tokens are renewed", {
        tokens: {
            accessToken: newAccesssTokens,
            refreshToken: newRefreshToken
        }
    }))
})

export const forgetPassword = asyncHandler(async (req: Request, res: Response) => {

    const { email } = req.body

    const token = await crypto.randomBytes(32).toString("hex")

    const user = await User.findOneAndUpdate({ email }, { forgotPasswordToken: token }, { new: true })

    if (!user) throw new ApiError(404, "User not found")

    const resetPasswordLink = `${env.BASEURL}:${env.PORT}/reset-password.html?id=${user._id}&token=${token}`;

    const mailContent = forgotPasswordMailGenContent(user.fullName, resetPasswordLink)

    sendMail({ email, subject: `Reset Password link`, mailGenContent: mailContent })

    return res.status(200).json(new ApiResponse(200, "Check Your Inbox"))
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {

    const { id, password, token } = req.body

    const user = await User.findOne({ _id: id, forgotPasswordToken: token })

    if (!user) throw new ApiError(403, "UnAuthorized request")

    user.password = password
    user.forgotPasswordToken = ""
    user.refreshToken = ""
    await user.save()

    return res.status(200).json(new ApiResponse(200, "Password has been changed"))
})

export const changepassword = asyncHandler(async (req: Request, res: Response) => {

    const { password: newPassword } = req.body

    const user = await User.findOne({ _id: req.user!._id })

    if (!user) throw new ApiError(401, "user not found")

    user.password = newPassword
    user.refreshToken = ""
    await user.save()

    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, "Password has been changed"))
})

