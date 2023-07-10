import { AppUser } from "../state/pk-system-state";

export interface IMessage {
    text: string,
    id: string,
    sender: AppUser
}