import { createSubTask, createTask, deleteSubTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from "@/controllers/task";
import { isAuth } from "@/middlewares/isAuth";
import { upload } from "@/middlewares/multer";
import { validate } from "@/middlewares/validator";
import { createTaskSchema, updateTaskSchema } from "@/validators/taskSchema";
import { Router } from "express";

export const router: Router = Router()

router.use(isAuth)

router.post("/", upload.single("attachments"), validate(createTaskSchema), createTask)
router.get("/:projectId", getTasks)
router.get("/task-details/:taskId", getTaskById)
// router.patch("/:taskId", upload.single("attachments"), validate(updateTaskSchema), updateTask)
router.patch("/:taskId", validate(updateTaskSchema), updateTask)
router.delete("/:taskId", deleteTask)

router.post("/create-subtask", createSubTask)
router.post("/delete-subtask/:subtaskId", deleteSubTask)
router.post("/update-subtask/:subtaskId", updateSubTask)