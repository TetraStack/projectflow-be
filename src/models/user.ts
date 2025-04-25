import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@/env";

interface userType extends Document {
    avatar: { url: String, filename: String },
    username: string,
    email: string,
    fullName: string,
    password: string,
    isEmailVerified: boolean,
    refreshToken: string,
    forgotPasswordToken: string,
    forgotPasswordTokenExpiry: Date,
    emailVerificationToken: string,
    emailVerificationTokenExpiry: Date,
}

interface Methods {
    isPasswordCorrect: (password: string) => Promise<boolean>;
    generateAccesssTokens: () => string
    generateRefreshTokens: () => string
}

const userSchema = new Schema<userType, {}, Methods>({
    avatar: {
        type: {
            url: String, filename: String,
        },
        default: {
            url: `https://placehold.co/600x400`,
            filename: ""
        }
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        expires: 60 * 60 * 2
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationTokenExpiry: {
        type: Date,
        expires: 60 * 60 * 24
    },

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccesssTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "24h"
        })

}
userSchema.methods.generateRefreshTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "30d"
        })

}

export const User = model("User", userSchema)