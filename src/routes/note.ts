import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "@/controllers/note";
import { Router } from "express";

export const router: Router = Router()

router.get("/", getNotes)
router.get("/:id", getNoteById)
router.post("/", createNote)
router.patch("/:id", updateNote)
router.delete("/:id", deleteNote)

