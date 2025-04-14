import 'dotenv/config'
import { env } from './env';
import connectDB from "@/db"
import express from "express";
import app from './app';

app.use(express.json())
const PORT = env.PORT ?? 8000

//import routes here
import { router as HealthCheckRouter } from "@/routes/healthCheck"

app.use("/api/v1/healthCheck", HealthCheckRouter)

connectDB().then(() => app.listen(PORT, () => {
    console.log(`server running on ${env.BASEURL}:${PORT}`)
}))

