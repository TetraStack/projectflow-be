import { healthCheck } from "@/controllers/healthCheck.controller";
import { Router } from "express";

export const router: Router = Router()

router.get("/", healthCheck)
