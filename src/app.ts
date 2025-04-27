import express, { Express } from "express";
import cookieParser from "cookie-parser";

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("src/public"));
app.use(cookieParser());

//import routes here
import { router as HealthCheckRouter } from "@/routes/healthCheck"
import { router as userRouter } from "@/routes/auth"
import { router as projectRouter } from "@/routes/project"
import { router as taskRouter } from "@/routes/task"
import { router as noteRouter } from "@/routes/note"
import { errorHandler } from "./middlewares/errorHandler";

app.use("/api/v1/healthcheck", HealthCheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/task", taskRouter)
app.use("/api/v1/note", noteRouter)

app.use(errorHandler);
export default app