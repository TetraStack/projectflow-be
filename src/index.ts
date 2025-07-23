import 'dotenv/config'
import { env } from './validators/env';
import connectDB from "@/db"
import app from './app';
import http from 'http'
import { initSocket } from '@/config/socket'

const PORT = env.PORT ?? 8000

const server = http.createServer(app);
initSocket(server)

connectDB().then(() => server.listen(PORT, () => {
    console.log(`server running on ${env.BASEURL}:${PORT}`)
}))

