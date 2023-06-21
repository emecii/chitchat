import { IMessage } from "../types/IMessage";
import GenderType from "../types/GenderType"
import { Model } from "../types/Model";
import UserRole from "../types/UserRole";

export const pkSystemState: PkSystemState = {
    isFlippedCardOne: false,
    curImageId: 0,
    messageList: [] as IMessage[],
    user: {
        id: "unknown",
        gender: GenderType.UNKNOWN,
        userName: "User",
        role: UserRole.GUEST,  // default guest
    },
    modelArrays: [] as Model[],
    curModelName: "AI角色",
    curModelSrc: "",
    curModelIdString: "",
    modalOpen: false,
    isLoggedIn: false,
};

export type PkSystemState = {
    isFlippedCardOne: boolean | undefined;
    curImageId: number;
    messageList: IMessage[];
    user: {
        id: string,
        gender: GenderType,
        userName: string,
        role: UserRole,
    }
    modelArrays: Model[];
    curModelName: string;
    curModelSrc: string;
    modalOpen: boolean;
    curModelIdString: string;
    isLoggedIn: boolean;
};
