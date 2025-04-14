import { healthCheck } from "@/controllers/healthCheck";
import { Router } from "express";

export const router: Router = Router()

router.get("/", healthCheck)