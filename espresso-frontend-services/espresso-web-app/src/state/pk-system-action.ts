import GenderType from "../types/GenderType";
import { IMessage } from "../types/IMessage";
import { randomIntBetweenZeroAndXButNotY } from "../util/randomIntBetweenZeroAndX";
import { pkSystemApi } from "./pk-system-hook";
import axios from 'axios';
import { genderToRequiredGender } from "../util/genderToRequiredGender";
import { HttpStatus } from "../types/HttpStatus";
import { message } from "antd";
import { Model } from "../types/Model";
import { createRandomUserId } from "../util/createRandomUserId";
var console = require("console-browserify")
export const pkSystemAction = {
    fetchUserProfile: (gender: GenderType, userName: string) =>
    async ({ setState, getState }: pkSystemApi) => {
        // if user id still unknow, will assgin a random id to this user
        let curUserId = getState().userId;
        if(curUserId === "unknown") {
            curUserId = createRandomUserId();
            setState({userId: curUserId});
        }
        console.log("fetchUserProfile gender", gender, "userName:", userName, "userID:", curUserId);
        await axios
            .post(`https://chitchat-ai-backend:3000/user-profile`,
                {
                    "user_id" : curUserId,
                    "user_name" : userName,
                    "gender" : gender
                })
            .then((response) => {
                console.log("fetchModelProfile", response)
                if(response.status === HttpStatus.OK) {
                    console.log("fetchModelProfile message", response.data.message)
                }
                else {
                    message.error("页面错误，请刷新重试")
                    console.log("fetchUserProfile response failed", response)
                }
                
            })
            .catch((err) => {
                message.error("页面错误，请刷新重试");
                console.log(err)
            } );

    },
    fetchModelProfile:
        (gender: GenderType) =>
            async ({ setState, getState }: pkSystemApi) => {
                // send reqire models
                console.log("gender", gender, "genderToRequiredGender", genderToRequiredGender[gender])
                await axios
                    .get(`https://chitchat-ai-backend:3000/model-profile`,
                        {
                            params: {
                                gender: genderToRequiredGender[gender]
                            }
                        })
                    .then((response) => {
                        console.log("fetchModelProfile", response)
                        if(response.status === HttpStatus.OK) {
                            const curModelArray = response.data.data as Model[];
                            setState({modelArrays : curModelArray});
                            console.log("modelArray[0]", getState().modelArrays[0]);
                        }
                        else {
                            message.error("页面错误，请刷新重试")
                            console.log("fetchModelProfile response failed", response)
                        }
                        
                    })
                    .catch((err) => {
                        message.error("页面错误，请刷新重试");
                        console.log(err)
                    } );

            },
    setUserName:
        (uName: string) =>
            ({ setState }: pkSystemApi) => {
                console.log("set user name: ", uName)
                setState({ curUserName: uName });
            },
    setUserToken:
        (uToken: string) =>
            ({ setState }: pkSystemApi) => {
                console.log("set user Token: ", uToken)
                setState({ userToken: uToken });
            },
    setUserId:
        (uId: string) =>
            ({ setState }: pkSystemApi) => {
                console.log("set userId: ", uId)
                setState({ userId: uId });
            },
    setGender:
        (gender: GenderType) =>
            ({ setState }: pkSystemApi) => {
                console.log("set gender: ", gender)
                setState({ userGender: gender });
            },
    handleFlipCardOne:
        () =>
            ({ getState, setState }: pkSystemApi) => {
                const currentState = getState();
                setState({ isFlippedCardOne: !currentState.isFlippedCardOne });
            },
    randomPickImageId:
        () =>
            ({ getState, setState }: pkSystemApi) => {
                const newImageId = randomIntBetweenZeroAndXButNotY(getState().modelArrays.length, getState().curImageId);
                setState({ curImageId: newImageId });
            },
    updateMessageList:
        (message: IMessage) =>
            ({ getState, setState }: pkSystemApi) => {
                const newMessageList: IMessage[] = JSON.parse(JSON.stringify(getState().messageList));
                newMessageList.push(message);
                setState({ messageList: newMessageList });
            },
    initailMessageList:
        (message: IMessage) =>
            ({ getState, setState }: pkSystemApi) => {
                const newMessageList: IMessage[] = JSON.parse(JSON.stringify(getState().messageList));
                newMessageList.push(message);
                setState({ messageList: newMessageList });
            },
};

export type PkSystemAction = typeof pkSystemAction;
