import { User } from "../schemas/User";

export class GetUserBySocketIdService {

    async execute (socket_id: string) {
    
        const user = await User.findOne({ socket_id })

        return user
    }
}