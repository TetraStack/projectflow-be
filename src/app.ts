import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logRequests } from "./middlewares/logRequests";

const app: Express = express()

// swagger setup
import swaggerui from "swagger-ui-express"
import * as swaggerDocument from "./swagger-output.json"

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,

}));

app.use(logRequests)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("src/public"));
app.use(cookieParser());
app.use("/", swaggerui.serve, swaggerui.setup(swaggerDocument));

//import routes here
import { router as HealthCheckRouter } from "@/routes/healthCheck.route"
import { router as userRouter } from "@/routes/auth.route"
import { router as projectRouter } from "@/routes/project.route"
import { router as taskRouter } from "@/routes/task.route"
import { router as noteRouter } from "@/routes/note.route"
import { errorHandler } from "./middlewares/errorHandler";

app.use("/v1/healthcheck", HealthCheckRouter)
app.use("/v1/user", userRouter)
app.use("/v1/project", projectRouter)
app.use("/v1/task", taskRouter)
app.use("/v1/note", noteRouter)

app.use(errorHandler);
export default app