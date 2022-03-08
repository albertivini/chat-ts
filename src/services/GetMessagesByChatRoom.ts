import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
export class GetMessagesByChatRoomService {


    async execute (roomId: string) {

        const messages = Message.find({ roomId }).populate("to")

        return messages
    }
}