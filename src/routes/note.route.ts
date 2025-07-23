import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "@/controllers/note.controller";
import { isAuth } from "@/middlewares/isAuthenticated";
import { validate } from "@/middlewares/validator";
import { createNoteSchema, updateNoteSchema } from "@/validators/noteSchema";
import { Router } from "express";

export const router: Router = Router()

router.use(isAuth)

router.post("/", validate(createNoteSchema), createNote)
router.get("/:projectId", getNotes)
router.get("/note-details/:noteId", getNoteById)
router.patch("/:noteId", validate(updateNoteSchema), updateNote)
router.delete("/:noteId", deleteNote)

