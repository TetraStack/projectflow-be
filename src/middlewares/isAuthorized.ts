import { ProjectMember } from "@/models/projectMember";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { UserRolesEnum } from "@/utils/constants";
import { NextFunction, Request } from "express";
import mongoose from "mongoose";

export const isAuthorized = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?._id
    const { projectId } = req.params
    const memberRole = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(userId),
        project: new mongoose.Types.ObjectId(projectId)
    })

    if (!memberRole) throw new ApiError(403, "You are not a member of this project")

    if (memberRole.role !== UserRolesEnum.ADMIN || memberRole.role !== UserRolesEnum.PROJECT_ADMIN) throw new ApiError(403, "Unauthorized request")

    next()
})