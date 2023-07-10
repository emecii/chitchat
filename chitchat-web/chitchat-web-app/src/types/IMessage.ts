import { LoginUser } from "../state/pk-system-state";

export interface IMessage {
    text: string,
    id: string,
    sender: LoginUser
}