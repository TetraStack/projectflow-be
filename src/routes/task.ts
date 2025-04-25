import { createSubTask, createTask, deleteSubTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from "@/controllers/task";
import { Router } from "express";

export const router: Router = Router()

router.post("/create-subtask", createSubTask)
router.post("/", createTask)
router.post("/delete-subtask/:subtaskId", deleteSubTask)
router.delete("/:taskId", deleteTask)
router.get("/:taskId", getTaskById)
router.get("/", getTasks)
router.post("/update-subtask/:subtaskId", updateSubTask)
router.patch("/:taskId", updateTask)