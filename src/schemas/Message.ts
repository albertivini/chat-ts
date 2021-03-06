import mongoose, { Document , Schema } from "mongoose";

type Message = Document & {
    to: string
    text: string
    created_at: Date
    roomId: string
}

const MessageSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    text: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    roomId: {
        type: String,
        ref: "chatRoom"
    },
})

const Message = mongoose.model<Message>("messages", MessageSchema)

export { Message }