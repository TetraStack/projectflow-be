import express from "express";

export interface decodeUserType {
    _id: string, email: string, username: string
}

declare global {
    namespace Express {
        interface Request {
            user?: decodeUserType
        }
    }
}
