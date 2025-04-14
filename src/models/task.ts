import { AvailableTaskStatuses, TaskStatusEnum } from "@/utils/constants";
import mongoose, { Schema, model } from "mongoose";
import { string } from "zod";

interface taskType extends Document {
    title: string,
    description: string,
    project: mongoose.ObjectId,
    assignedTo: mongoose.ObjectId,
    assignedBy: mongoose.ObjectId,
    status: string,
    attachments: [{
        url: string,
        mimeType: String,
        size: Number
    }]
}

const taskSchema = new Schema<taskType>({
    title: {
        type: String
    },
    description: {
        type: String
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: AvailableTaskStatuses,
        default: TaskStatusEnum.TODO
    },
    attachments: {
        type: [
            {
                url: string,
                mimeType: String,
                size: Number
            }
        ],
        default: []
    },
}, { timestamps: true })

export const Task = model("Task", taskSchema)