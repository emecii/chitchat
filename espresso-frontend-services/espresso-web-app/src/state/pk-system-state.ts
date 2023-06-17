import { IMessage } from "../types/IMessage";
import GenderType from "../types/GenderType"
import { Model } from "../types/Model";

export const pkSystemState = {
    isFlippedCardOne: false,
    curImageId: 0,
    messageList: [] as IMessage[],
    userGender: GenderType.UNKNOWN,
    userId: "unknown",
    userName: "User",
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
    userGender: GenderType;
    userId: string;
    userName: string;
    modelArrays: Model[];
    curModelName: string;
    curModelSrc: string;
    modalOpen: boolean;
    curModelIdString: string;
    isLoggedIn: boolean;
};
