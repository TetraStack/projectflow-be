import { Project } from "@/models/project";
import { SubTask } from "@/models/subtask";
import { Task } from "@/models/task";
import { User } from "@/models/user";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { uploadTos3 } from "@/utils/awsHelper";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createTask = asyncHandler(async (req: Request, res: Response) => {

    let { title, description, project, assignedTo, status } = req.body

    // check project id from db
    const isvalidProjectId = await Project.findById({ _id: new mongoose.Types.ObjectId(project) })

    if (!isvalidProjectId) throw new ApiError(422, "Project id is not valid")

    // check user id of assidnedTo from db
    const isvalidUserId = await User.findById({ _id: new mongoose.Types.ObjectId(assignedTo) })

    if (!isvalidUserId) throw new ApiError(422, "assignedTo is not valid")

    let attachments = undefined
    if (req.file) {
        const { response, link } = await uploadTos3(req.file!.filename, req.file!.path)

        if (!response.VersionId) {
            throw new ApiError(500, "Something went wrong while uploading file.")
        }

        attachments = [{
            url: link, mimeType: req.file.mimetype, size: req.file.size
        }]
    }

    const createdTask = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(project),
        assignedTo: new mongoose.Types.ObjectId(assignedTo),
        assignedBy: new mongoose.Types.ObjectId(req.user?._id),
        status,
        attachments

    })

    if (!createdTask) throw new ApiError(500, "Something went wrong")

    res.status(201).json(new ApiResponse(201, "Task has been added", {
        task: {
            title,
            description,
            project: {
                name: isvalidProjectId.name,
                description: isvalidProjectId.description
            },
            assignedto: {
                name: isvalidUserId.fullName,
                username: isvalidUserId.username,
                email: isvalidUserId.email,
                avatar: isvalidUserId.avatar,
            },
            assignedBy: req.user?._id,
            status,
            attachments
        }
    }))
})

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params

    if (!projectId) throw new ApiError(422, "Please provide projectId")

    const tasks = (await Project.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "project",
                as: "tasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "assignedTo",
                            foreignField: "_id",
                            as: "assignedTo",
                            pipeline: [
                                {
                                    $project: {
                                        userId: "$_id",
                                        avatar: 1,
                                        username: 1,
                                        email: 1,
                                        fullname: 1,
                                        _id: 0
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $unwind: {
                            path: "$assignedTo",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "assignedBy",
                            foreignField: "_id",
                            as: "assignedBy",
                            pipeline: [
                                {
                                    $project: {
                                        userId: "$_id",
                                        avatar: 1,
                                        username: 1,
                                        email: 1,
                                        fullname: 1,
                                        _id: 0
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $unwind: {
                            path: "$assignedBy",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "subtasks",
                            localField: "_id",
                            foreignField: "task",
                            as: "subtask",
                            pipeline: [
                                {
                                    $project: {
                                        title: 1,
                                        isCompleted: 1,
                                        createdBy: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            assignedTo: 1,
                            status: 1,
                            attachments: 1,
                            assignedBy: 1,
                            subtask: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                tasks: 1
            }
        }
    ]))[0]

    if (!tasks) {
        throw new ApiError(401, "No data found for projectId")
    }

    res.status(200).json(new ApiResponse(200, "Tasks has been fetched", {
        project: {
            proejctId: tasks._id,
            name: tasks.name,
            description: tasks.description
        },
        tasks: tasks.tasks
    }))
})

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params

    if (!taskId) throw new ApiError(422, "Please provide taskId")

    const task = (await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        $project: {
                            userId: "$_id",
                            avatar: 1,
                            username: 1,
                            email: 1,
                            fullname: 1,
                            _id: 0
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedBy",
                foreignField: "_id",
                as: "assignedBy",
                pipeline: [
                    {
                        $project: {
                            userId: "$_id",
                            avatar: 1,
                            username: 1,
                            email: 1,
                            fullname: 1,
                            _id: 0
                        }
                    }
                ]
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            description: 1,
                        }
                    }
                ]
            },
        },
        {
            $unwind: {
                path: "$assignedTo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$assignedBy",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$project",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            isCompleted: 1,
                            createdBy: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                subtasks: 1,
                assignedTo: 1,
                assignedBy: 1,
                status: 1,
                attachments: 1,
                project: 1,
            }
        }
    ]))[0]

    console.log(task)

    if (!task) throw new ApiError(401, `No data found for ${taskId}`)

    res.status(200).json(new ApiResponse(200, "Task details has been fetched", {
        _id: task._id,
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        assignedBy: task.assignedBy,
        status: task.status,
        attachments: task.attachments,
        project: task.project
    }))
})

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params

    const { title, description, projectId, assignedTo, status } = req.body

    const task = await Task.findById({
        _id: new mongoose.Types.ObjectId(taskId)
    })

    if (!task) throw new ApiError(401, "task not found!")

    if (title) task.title = title
    if (description) task.description = description
    if (projectId) {
        const project = await Project.findById({
            _id: new mongoose.Types.ObjectId(projectId)
        })

        if (!project) throw new ApiError(422, "Invalid projectId")
        task.project = projectId
    }
    if (assignedTo) {
        task.assignedTo = assignedTo
        const user = await User.findById({
            _id: new mongoose.Types.ObjectId(assignedTo)
        })

        if (!user) throw new ApiError(422, "Invalid assignedTo ID")
    }
    if (status) task.status = status

    await task.save()

    res.status(200).json(new ApiResponse(200, "Task has been updated.", {
        _id: task._id,
        title: task.title,
        description: task.description,
        projectId: task.project,
        assignedTo: task.assignedTo,
        status: task.status
    }))

})

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params

    if (!taskId) throw new ApiError(422, "Please provide taskId")

    const deletedtask = await Task.deleteOne({
        _id: new mongoose.Types.ObjectId(taskId)
    })

    if (!deletedtask.deletedCount) throw new ApiError(401, "task not found")

    await SubTask.deleteMany({
        task: new mongoose.Types.ObjectId(taskId)
    })

    res.status(200).json(
        new ApiResponse(200, "Task has been deleted")
    )
})

export const createSubTask = asyncHandler(async (req: Request, res: Response) => {

    const { title, taskId, isCompleted } = req.body

    const task = await Task.findById({
        _id: new mongoose.Types.ObjectId(taskId),
    })

    if (!task) throw new ApiError(400, "Invalid taskId")

    const insertedSubTask = await SubTask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        isCompleted,
        createdBy: new mongoose.Types.ObjectId(req.user?._id)
    })

    if (!insertedSubTask) throw new ApiError(500, "Something went wrong")

    res.status(201).json(new ApiResponse(201, "SubTask has been added", {
        subtask: {
            title,
            taskId,
            isCompleted,
            createdBy: new mongoose.Types.ObjectId(req.user?._id)
        }
    }))
})

export const deleteSubTask = asyncHandler(async (req: Request, res: Response) => {
    const { subtaskId } = req.params

    if (!subtaskId) throw new ApiError(400, "Please provide subtaskId")

    const deletedSubTask = await SubTask.deleteOne({
        _id: new mongoose.Types.ObjectId(subtaskId)
    })

    if (!deletedSubTask.deletedCount) throw new ApiError(400, "Invalid subtaskId")

    res.status(200).json(
        new ApiResponse(200, "SubTask has been deleted")
    )
})

export const updateSubTask = asyncHandler(async (req: Request, res: Response) => {
    const { subtaskId } = req.params
    const { title, taskId, isCompleted } = req.body

    const task = await Task.findById({
        _id: new mongoose.Types.ObjectId(taskId)
    })

    if (!task) throw new ApiError(400, "Invalid taskId")

    const subTask = await SubTask.findById({
        _id: new mongoose.Types.ObjectId(subtaskId)
    })

    if (!subTask) throw new ApiError(400, "Invalid SubtaskId")

    if (title) subTask.title = title
    if (isCompleted) subTask.isCompleted = isCompleted
    if (taskId) subTask.task = taskId

    await subTask.save()

    res.status(200).json(
        new ApiResponse(200, "Subtask has been updated", {
            _id: subTask._id,
            title: subTask.title,
            taskId: subTask.task,
            isCompleted: subTask.isCompleted
        })
    )
})

