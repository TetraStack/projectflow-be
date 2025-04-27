import { Project } from "@/models/project";
import { ProjectMember } from "@/models/projectMember";
import { Task } from "@/models/task";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { UserRolesEnum } from "@/utils/constants";
import { getRole } from "@/utils/helper";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createProject = asyncHandler(async (req: Request, res: Response) => {

    const { name, description } = req.body

    const user_id = req.user!._id

    const insertedData = await Project.create({
        name,
        description,
        createdBy: user_id
    })

    if (!insertedData) throw new ApiError(500, "Something went wrong")

    const projectMember = await ProjectMember.create({
        role: UserRolesEnum.ADMIN,
        project: insertedData._id,
        user: user_id
    })

    if (!projectMember) throw new ApiError(500, "Something went wrong")

    res.status(201).json(new ApiResponse(200, "Project has been added."))
})

export const getProjects = asyncHandler(async (req: Request, res: Response) => {

    const user_id = req.user!._id

    // const projects = await Project.find({ createdBy: user_id }).select("-__v")

    const projects = await Project.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(user_id),
            },
        },
        {
            $lookup: {
                from: "projectmembers",
                localField: "_id",
                foreignField: "project",
                as: "members",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userDetails",
                            pipeline: [
                                { $project: { fullName: 1, email: 1, username: 1, _id: 0, } },
                            ]
                        },
                    },
                    {
                        $project: {
                            role: 1,
                            fullName: { $first: "$userDetails.fullName" },
                            email: { $first: "$userDetails.email" },
                            username: { $first: "$userDetails.username" }
                        },
                    }
                ]
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
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            assignedTo: 1,
                            assignedBy: 1,
                            status: 1,
                            attachments: 1,
                            subtasks: 1

                        }
                    }

                ]
            }
        },
        {
            $lookup: {
                from: "projectnotes",
                localField: "_id",
                foreignField: "project",
                as: "notes",
                pipeline: [
                    {
                        $project: {
                            createdBy: 1,
                            content: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                members: 1,
                name: 1,
                description: 1,
                tasks: 1,
                notes: 1
            }
        }
    ])

    if (!projects) throw new ApiError(401, "No Data found")

    res.status(200).json(new ApiResponse(200, "Projects has been fetched", {
        projects
    }))
})

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params

    const project = (await Project.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId),
            },
        },
        {
            $lookup: {
                from: "projectmembers",
                localField: "_id",
                foreignField: "project",
                as: "members",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userDetails",
                            pipeline: [
                                { $project: { fullName: 1, email: 1, username: 1, _id: 0, } },
                            ]
                        },
                    },
                    {
                        $project: {
                            role: 1,
                            fullName: { $first: "$userDetails.fullName" },
                            email: { $first: "$userDetails.email" },
                            username: { $first: "$userDetails.username" }
                        },
                    }
                ]
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
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            assignedTo: 1,
                            assignedBy: 1,
                            status: 1,
                            attachments: 1,
                            subtasks: 1

                        }
                    }

                ]
            }
        },
        {
            $lookup: {
                from: "projectnotes",
                localField: "_id",
                foreignField: "project",
                as: "notes",
                pipeline: [
                    {
                        $project: {
                            createdBy: 1,
                            content: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                members: 1,
                name: 1,
                description: 1,
                tasks: 1,
                notes: 1
            }
        }
    ]))[0]

    if (!project) throw new ApiError(401, "No Data found")

    res.status(200).json(new ApiResponse(200, "Project details has been fetched", {
        project
    }))
})

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params

    const userRole = await getRole(req.user!._id, projectId)
    if ((userRole === UserRolesEnum.MEMBER) || (userRole === "NoPermission")) {
        throw new ApiError(403, "UnAuthorized request")
    }

    const project = await Project.findOneAndDelete({ _id: projectId })

    if (!project) throw new ApiError(401, "No Data found")

    await ProjectMember.deleteMany(
        { project: new mongoose.Types.ObjectId(projectId) })

    const deletedTask = await Task.deleteMany({
        project: new mongoose.Types.ObjectId(projectId)
    })

    res.status(200).json(new ApiResponse(200, "Project has been deleted"))
})

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
    let projectId = req.params.projectId
    const { name, description } = req.body

    const userRole = await getRole(req.user!._id, projectId)
    if ((userRole === UserRolesEnum.MEMBER) || (userRole === "NoPermission")) {
        throw new ApiError(403, "UnAuthorized request")
    }

    const project = await Project.findById({ _id: projectId })

    if (!project) throw new ApiError(401, "Project not found")

    if (name) project.name = name
    if (description) project.description = description
    await project.save()

    if (!project) throw new ApiError(401, "No Data found")
    res.status(200).json(new ApiResponse(200, "Project has been updated", {
        project
    }))
})

export const addMemberToProject = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, memberId } = req.params
    const { role } = req.body

    const userRole = await getRole(req.user!._id, projectId)

    if ((userRole === UserRolesEnum.MEMBER) || (userRole === "NoPermission")) {
        throw new ApiError(403, "UnAuthorized request")
    }

    if (!projectId) throw new ApiError(422, "Please provide projectId")
    if (!memberId) throw new ApiError(422, "Please provide memberId")

    const insertedData = await ProjectMember.create({
        role,
        project: projectId,
        user: memberId
    })

    if (!insertedData) throw new ApiError(500, "Something went wrong while adding to database")

    res.status(201).json(new ApiResponse(201, "Member has been added to project."))
})

export const getProjectMembers = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params

    if (!projectId) throw new ApiError(422, "Please provide ProjectId")

    const members = await ProjectMember.aggregate(
        [
            {
                $match: {
                    project: new mongoose.Types.ObjectId(projectId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "members",
                    pipeline: [
                        {
                            $project: {
                                avatar: 1,
                                username: 1,
                                email: 1,
                                fullName: 1,

                            },
                        }
                    ]
                }
            },
            {
                $project: {
                    avatar: { $first: "$members.avatar" },
                    username: { $first: "$members.username" },
                    email: { $first: "$members.email" },
                    fullName: { $first: "$members.fullName" },
                    userId: { $first: "$members._id" },
                    _id: 0,
                    role: 1
                }
            }
        ]
    )

    if (!members) throw new ApiError(500, "Something went wrong")

    res.status(200).json(new ApiResponse(200, "Project Member has been fetched", members))
})

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {

    const { projectId, userId } = req.params
    const { role } = req.body

    const userRole = await getRole(req.user!._id, projectId)
    if ((userRole === UserRolesEnum.MEMBER) || (userRole === "NoPermission")) {
        throw new ApiError(403, "UnAuthorized request")
    }

    if (!projectId) throw new ApiError(422, "Please provide projectId")
    if (!userId) throw new ApiError(422, "Please provide userId")

    const updatedData = await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(userId),
            project: new mongoose.Types.ObjectId(projectId),
        },
        { role },
        { new: true })

    if (!updatedData) {
        throw new ApiError(500, "Something went wrong")
    }

    res.status(200).json(new ApiResponse(200, "Role has been updated"))

})

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, userId } = req.params

    const userRole = await getRole(req.user!._id, projectId)
    if ((userRole === UserRolesEnum.MEMBER) || (userRole === "NoPermission")) {
        throw new ApiError(403, "UnAuthorized request")
    }

    if (!projectId) throw new ApiError(422, "Please provide projectId")
    if (!userId) throw new ApiError(422, "Please provide userId")

    const deletedData = await ProjectMember.findOneAndDelete(
        {
            user: new mongoose.Types.ObjectId(userId),
            project: new mongoose.Types.ObjectId(projectId),
        })

    if (!deletedData) {
        throw new ApiError(500, "Something went wrong")
    }

    res.status(200).json(new ApiResponse(200, "Member has been deleted from the project."))
})