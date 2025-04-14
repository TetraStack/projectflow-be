import 'dotenv/config'
import { env } from './env';
import connectDB from "@/db"
import express from "express";
import app from './app';

app.use(express.json())
app.get("/", (req, res) => {
    res.status(200).json("It is up and running...")
})

const PORT = env.PORT ?? 8000

connectDB().then(() => app.listen(PORT, () => {
    console.log(`server running on ${env.BASEURL}:${PORT}`)
}))

