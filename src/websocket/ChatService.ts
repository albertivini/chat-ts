import { container } from "tsyringe"
import { io } from "../http"
import { CreateChatRoomService } from "../services/CreateChatRoom"
import { CreateMessageService } from "../services/CreateMessage"
import { CreateUserService } from "../services/CreateUser"
import { GetAllUsersService } from "../services/GetAllUsers"
import { GetChatRoomByIdService } from "../services/GetChatRoomById"
import { GetChatRoomByUserService } from "../services/GetChatRoomByUser"
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoom"
import { GetUserBySocketIdService } from "../services/GetUserBySocketId"

io.on("connect", socket => {
    
    socket.on('start', async data => {
        
        const { email, avatar, name } = data
        const createUserService = container.resolve(CreateUserService)

        const user = await createUserService.execute({email, avatar, name, socket_id: socket.id })

        socket.broadcast.emit("new_users", user)
    })

    socket.on('get_users', async (callback) => {
        const getAllusersService = container.resolve(GetAllUsersService)

        const response = await getAllusersService.execute()

        callback(response)
    })

    socket.on('start_chat', async (data, callback) => {
        const createChatRoomService = container.resolve(CreateChatRoomService)
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService)
        const getChatRoomByUserService = container.resolve(GetChatRoomByUserService)
        const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService)

        const userLogged = await getUserBySocketIdService.execute(socket.id)

        let room = await getChatRoomByUserService.execute([data.idUser, userLogged._id])

        if (!room) {
            room = await createChatRoomService.execute([data.idUser, userLogged._id])
        }

        socket.join(room.idChatRoom)

        const messages = await getMessagesByChatRoomService.execute(room.idChatRoom)

        callback({room, messages})
    
    })

    socket.on('message', async (data) => {
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService)

        const user = await getUserBySocketIdService.execute(socket.id)

        const createMessage = container.resolve(CreateMessageService)

        const message = await createMessage.execute({ to: user._id , text: data.message, roomId: data.idChatRoom})

        io.to(data.idChatRoom).emit('message', { message, user })

        const getChatRoomById = container.resolve(GetChatRoomByIdService)

        const room = await getChatRoomById.execute(data.idChatRoom)

        const usersFrom = room.idUsers.find(response => String(response.id) !== String(user._id))

        io.to(usersFrom.socket_id).emit('notification', {
            newMessage: true,
            roomId: data.idChatRoom,
            from: user
        })
    })
}) 