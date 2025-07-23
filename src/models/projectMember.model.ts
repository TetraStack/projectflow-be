import { AvailableUserRoles, UserRolesEnum } from "@/utils/constants";
import mongoose, { Schema, model } from "mongoose";

interface projectMemberType extends Document {
    user: mongoose.ObjectId,
    project: mongoose.ObjectId,
    role: string
}

const projectMemberSchema = new Schema<projectMemberType>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.MEMBER
    }
}, { timestamps: true })

export const ProjectMember = model("ProjectMember", projectMemberSchema)