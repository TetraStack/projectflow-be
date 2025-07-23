import { getIO } from "@/config/socket";
import { projectType } from "@/models/project.model";

export const emitToProject = (projectId: string, event: string, payload: projectType) => {
    const io = getIO();
    io.to(projectId).emit(event, payload)
}