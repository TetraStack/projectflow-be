import { ProjectMember } from "@/models/projectMember"
import mongoose from "mongoose"
import { ApiError } from "./apiError"

export const getRole = async (userId: string, projectId: string,) => {
    try {
        const memberRole = await ProjectMember.findOne({
            user: new mongoose.Types.ObjectId(userId),
            project: new mongoose.Types.ObjectId(projectId)
        })

        if (!memberRole) return "NoPermission"

        return memberRole.role
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}