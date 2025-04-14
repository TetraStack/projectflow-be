import mongoose, { Schema, model } from "mongoose";

interface subTaskType extends Document {
    title: string,
    task: mongoose.ObjectId,
    isCompleted: boolean,
    createdBy: mongoose.ObjectId
}

const subTaskSchema = new Schema<subTaskType>({
    title: {
        type: String
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

export const SubTask = model("SubTask", subTaskSchema)