import React, { useEffect, useRef, useState } from 'react'
import { usePkSystemHook } from '../../state/pk-system-hook';
import { IMessage } from '../../types/IMessage';
import { User } from '../../types/User';
import { Chat } from './Chat';
import axios from 'axios';
import { ENDPOINT } from '../../types/Env';
import { useParams } from 'react-router-dom';
import GenderType from '../../types/GenderType';
import ChatHeader from './ChatHeader';
import { logSendMessageEvent } from '../../app/GaEvent';
import { useNavigate } from "react-router-dom";


interface Props {
  userId: string;
}

const MockUser1 =
  {
    name: "Jackfdweo2134183",
    avatar: "",
    uid: "01",
  } as User

var console = require("console-browserify")

const ChatBox: React.FC<Props> = () => {
  const navigate = useNavigate();
  const { modelIdLink } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [state, action] = usePkSystemHook();
  const [isBotTyping, setIsBotTyping] = useState(false);
  const fetchChatHeaderModels = async (userId: string): Promise<string[]> => {
    let models: string[] = [];

    try {
      const response = await axios.get(`${ENDPOINT}/api/chat-models`, {
        params: {
          user_id: userId,
        }
      });

      let activeModelIdArray = response.data.data as string[];

      if (activeModelIdArray.length > 0) {
        models = activeModelIdArray;
      }
    } catch (err) {
      console.log(err);
    }

    return models;
  };

  useEffect(() => {
    // if (state.curUserName === "User") {
    //   action.fetchUserProfile(GenderType.UNKNOWN, "未命名");
    // }
    // if directly access to a chat page, meanwhile the chat is not jumping from mybot
    if (!modelIdLink) {
      fetchChatHeaderModels(state.user.id).then(models => {
        if (models.length > 0) {
          // action.handleJoinChat(models[0]);
          navigate('/chat/' + models[0]);
        }
      })
    } else {
      action.handleJoinChat(modelIdLink);
      setIsLoading(false);
    }
  }, [modelIdLink, state.user.id]);

  return (
    <>
      <ChatHeader />
      <Chat
        messages={state.messageList}
        isLoading={isLoading}
        user={MockUser1}
        pageRef={messagesEnd}
        isBotTyping={isBotTyping}
        onSubmit={
          (mes: string) => {
            const newUserMessage = {
              "text": mes,
              "id": state.curImageId.toString(),
              "sender": {
                "name": state.user.userName,
                "uid": state.user.id,
                "avatar": state.user.gender === GenderType.FAMALE ? "https://chichat-images-1317940514.cos.ap-nanjing.myqcloud.com/static/WechatIMG4576.jpg" : "https://chichat-images-1317940514.cos.ap-nanjing.myqcloud.com/static/WechatIMG4577.jpg",
              }
            } as IMessage;

            action.updateMessageList(newUserMessage);
            // send post request
            logSendMessageEvent(state.curModelIdString);
            setIsBotTyping(true);
            axios
              .post(`${ENDPOINT}/api/send-message`,
                {
                  "user_id": state.user.id,
                  "model_id": state.curModelIdString,
                  "message": mes
                })
              .then((response) => {
                const message = response.data.message;
                const uID: string = response.data.user_id;
                const mID: string = response.data.model_id;
                const receivedMessage =
                  {
                    "text": message,
                    "id": mID,
                    "sender": {
                      "name": state.curModelName,
                      "uid": uID,
                      "avatar": state.curModelSrc,
                    }
                  } as IMessage;

                action.updateMessageList(receivedMessage);
                setIsBotTyping(false);
              })
              .catch((err) => {
                console.log(err);
                setIsBotTyping(false);
              });

          }} />
    </>
  )
};

export default ChatBox