import { Server } from "socket.io";
import http from "http"
import { env } from "@/config/env";
import { createAdapter } from "@socket.io/redis-adapter";
import createClient from 'ioredis';
import { register } from "module";
import { registerProjectSocket } from "@/sockets/project.socket";

let io: Server;

console.log("isProducation:", env.NODE_ENV === "production")

const pubClient = env.NODE_ENV === "production" ? new createClient({
    host: env.REDIS_URL,
    port: Number(env.REDIS_PORT),
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
}) : new createClient({ host: env.REDIS_URL, port: Number(env.REDIS_PORT), })
const subClient = pubClient.duplicate()

export const initSocket = (server: http.Server) => {

    io = new Server(server, {
        cors: {
            origin: env.FRONTEND_URL,
            credentials: true
        }
    })

    io.adapter(createAdapter(pubClient, subClient))

    // register all event handlers
    registerProjectSocket(io)

    return io

}

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initilized")

    const namespace = io.of("projectflow");

    return namespace
}
