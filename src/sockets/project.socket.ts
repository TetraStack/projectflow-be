import { Server, Socket } from "socket.io";

export const registerProjectSocket = (io: Server) => {

    const namespace = io.of("projectflow");

    namespace.on("connection", (socket: Socket) => {
        console.log("Socket Connected: ", socket.id)

        socket.on("joinProject", (projectId: string) => {
            socket.join(projectId)
            console.log(`Socket ${socket.id} joined project ${projectId}`)
        })

        socket.on("leaveProject", (projectId: string) => {
            socket.leave(projectId);
            console.log(`Socket ${socket.id} left project ${projectId}`)
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id)
        })
    })
}