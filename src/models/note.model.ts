import mongoose, { Schema, model } from "mongoose";

interface projectNoteType extends Document {
    createdBy: mongoose.ObjectId,
    project: mongoose.ObjectId,
    content: string
}

const projectNoteSchema = new Schema<projectNoteType>({
    project: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String
    },
}, { timestamps: true })

export const ProjectNote = model("ProjectNote", projectNoteSchema)