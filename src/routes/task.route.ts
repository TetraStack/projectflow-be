import { createSubTask, createTask, deleteSubTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from "@/controllers/task.controller";
import { isAuth } from "@/middlewares/isAuthenticated";
import { upload } from "@/middlewares/multer";
import { validate } from "@/middlewares/validator";
import { createSubTaskSchema, createTaskSchema, updateSubTaskSchema, updateTaskSchema } from "@/validators/taskSchema";
import { Router } from "express";

export const router: Router = Router()

router.use(isAuth)

router.post("/", upload.single("attachments"), validate(createTaskSchema), createTask)
router.get("/:projectId", getTasks)
router.get("/task-details/:taskId", getTaskById)
// router.patch("/:taskId", upload.single("attachments"), validate(updateTaskSchema), updateTask)
router.patch("/:taskId", validate(updateTaskSchema), updateTask)
router.delete("/:taskId", deleteTask)

router.post("/create-subtask", validate(createSubTaskSchema), createSubTask)
router.delete("/delete-subtask/:subtaskId", deleteSubTask)
router.patch("/update-subtask/:subtaskId", validate(updateSubTaskSchema), updateSubTask)