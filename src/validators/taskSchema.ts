import { TaskStatusEnum } from "@/utils/constants"
import * as z from "zod"

const TaskStatuskeys = Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum]

export const createTaskSchema = z.object({
    title: z.string({ required_error: "Title is required" }).min(1, "Title can't be empty"),
    description: z.string({ required_error: "description is required" }).min(1, "description can't be empty"),
    project: z.string({ required_error: "project is required" }).min(1, "project can't be empty"),
    assignedTo: z.string({ required_error: "assignedTo is required" }).min(1, "assignedTo can't be empty"),
    status: z.enum(TaskStatuskeys, {
        required_error: 'You must select valid Task Status!',
    }),
})

export const updateTaskSchema = z.object({
    title: z.string({ required_error: "Title is required" }).min(1, "Title can't be empty").optional(),
    description: z.string({ required_error: "description is required" }).min(1, "description can't be empty").optional(),
    projectId: z.string({ required_error: "project is required" }).min(1, "project can't be empty").optional(),
    assignedTo: z.string({ required_error: "assignedTo is required" }).min(1, "assignedTo can't be empty").optional(),
    status: z.enum(TaskStatuskeys, {
        required_error: 'You must select valid Task Status!',
    }).optional(),
}).refine(data => data.title || data.description || data.projectId || data.assignedTo || data.status, {
    message: " Nothing to update."
})

export const createSubTaskSchema = z.object({
    title: z.string({ required_error: "Title is required" }).min(1, "Title can't be empty"),
    taskId: z.string({ required_error: "taskId is required" }).min(1, "taskId can't be empty"),
    isCompleted: z.string().optional(),
})

export const updateSubTaskSchema = z.object({
    title: z.string().min(1, "Title can't be empty").optional(),
    taskId: z.string().min(1, "taskId can't be empty").optional(),
    isCompleted: z.string().optional(),
}).refine(data => data.title || data.taskId || data.isCompleted, {
    message: " Nothing to update."
})