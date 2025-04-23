import 'dotenv/config'
import { env } from './env';
import connectDB from "@/db"
import express from "express";
import app from './app';

const PORT = env.PORT ?? 8000

connectDB().then(() => app.listen(PORT, () => {
    console.log(`server running on ${env.BASEURL}:${PORT}`)
}))

