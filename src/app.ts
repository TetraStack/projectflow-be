import express, { Express } from "express";

const app: Express = express()

//import routes here
import { router as HealthCheckRouter } from "@/routes/healthCheck"

app.use("/api/v1/healthCheck", HealthCheckRouter)

export default app