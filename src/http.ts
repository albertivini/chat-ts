import 'reflect-metadata'
import express from "express"
import path from "path"
import http from "http"
import { Server } from "socket.io"
import "./config/MongoConnection"

const app = express()

const server = http.createServer(app)

app.use(express.static(path.join(__dirname, "..", "public")))

const io = new Server(server)

io.on("connection", socket => console.log() )

export { server, io }