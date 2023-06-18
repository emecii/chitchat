import { User } from "./User";

export interface IMessage {
    text: string,
    id: string,
    sender: User
}