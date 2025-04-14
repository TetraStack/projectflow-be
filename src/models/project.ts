import mongoose, { Schema, model } from "mongoose";

interface projectType extends Document {
    name: string,
    description: string,
    createdBy: mongoose.ObjectId
}

const projectSchema = new Schema<projectType>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Project = model("Project", projectSchema)