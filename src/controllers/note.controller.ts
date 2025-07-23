import { ProjectNote } from "@/models/note.model";
import { Project } from "@/models/project.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createNote = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, content } = req.body

    const project = await Project.findById({
        _id: new mongoose.Types.ObjectId(projectId)
    })

    if (!project) throw new ApiError(400, "Invalid ProjectId")

    const note = await ProjectNote.create({
        createdBy: req.user?._id,
        project: projectId,
        content
    })

    if (!note) throw new ApiError(500, "Something went wrong")

    res.status(201).json(new ApiResponse(201, "Note has been added", {
        _id: note._id,
        projectId: note.project,
        content

    }))

})

export const getNotes = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params

    if (!projectId) throw new ApiError(400, "Please provide ProjectId")

    const project = await Project.findById({
        _id: new mongoose.Types.ObjectId(projectId)
    })

    if (!project) throw new ApiError(400, "Invalid ProjectId")

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).select("-createdAt -updatedAt -__v")

    if (!notes) throw new ApiError(401, "No notes Found")

    res.status(200).json(new ApiResponse(200, "Notes have been fetched", {
        notes
    }))
})

export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
    const { noteId } = req.params
    if (!noteId) throw new ApiError(400, "Please provide noteId")

    const notes = await ProjectNote.find({
        _id: new mongoose.Types.ObjectId(noteId)
    }).select("-createdAt -updatedAt -__v")

    if (!notes) throw new ApiError(401, "No notes Found")

    res.status(200).json(new ApiResponse(200, "Notes have been fetched", {
        notes
    }))
})

export const updateNote = asyncHandler(async (req: Request, res: Response) => {

    const { content } = req.body
    const { noteId } = req.params

    const updatedNote = await ProjectNote.findByIdAndUpdate({
        _id: new mongoose.Types.ObjectId(noteId)
    })

    if (!updatedNote) throw new ApiError(400, "Invalid noteId")

    res.status(200).json(new ApiResponse(200, "Note has been updated", {
        _id: updatedNote._id,
        projectId: updatedNote.project,
        content
    }))

})

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {

    const { noteId } = req.params

    const deletedNote = await ProjectNote.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(noteId)
    })

    if (!deletedNote) throw new ApiError(401, "Invalid noteId")

    res.status(200).json(new ApiResponse(200, "Note has been deleted"))
})
