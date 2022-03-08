import { injectable } from "tsyringe";
import { ObjectId } from "mongoose"
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class GetChatRoomByUserService {
    async execute (idUsers: ObjectId[] ) {

        const room = await ChatRoom.findOne({
            idUsers: {
                $all: idUsers
            }
        })

        return room
    }
}