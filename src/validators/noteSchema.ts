import * as z from "zod"

export const createNoteSchema = z.object({
    projectId: z.string({ required_error: "projectId is required" }).min(1, "projectId can't be empty"),
    content: z.string({ required_error: "content is required" }).min(1, "content can't be empty")
})

export const updateNoteSchema = z.object({
    content: z.string({ required_error: "content is required" }).min(1, "content can't be empty")
})