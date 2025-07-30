import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Express = express()

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,

}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("src/public"));
app.use(cookieParser());

//import routes here
import { router as HealthCheckRouter } from "@/routes/healthCheck.route"
import { router as userRouter } from "@/routes/auth.route"
import { router as projectRouter } from "@/routes/project.route"
import { router as taskRouter } from "@/routes/task.route"
import { router as noteRouter } from "@/routes/note.route"
import { errorHandler } from "./middlewares/errorHandler";

app.use("/api/v1/healthcheck", HealthCheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/task", taskRouter)
app.use("/api/v1/note", noteRouter)

app.use(errorHandler);
export default app