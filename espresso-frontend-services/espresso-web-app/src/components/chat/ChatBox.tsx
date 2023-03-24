import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { pkSystemApi, usePkSystemHook } from '../../state/pk-system-hook';
import { IMessage } from '../../types/IMessage';
import { User } from '../../types/User';
import { Chat } from './Chat';
import axios from 'axios';

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
  const [isLoading, setIsLoading] = useState(true);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [state, action] = usePkSystemHook();

  useEffect(() => {
    if (state.messageList.length > 0) {
      setIsLoading(false);
    }
  }, [state.messageList]);

  return (
    <Chat
      messages={state.messageList}
      isLoading={isLoading}
      user={MockUser1}
      pageRef={messagesEnd}
      onSubmit={
        (mes: string) => {
          const newUserMessage = {
            "text": mes,
            "id": state.curImageId.toString(),
            "sender": {
              "name": state.curUserName,
              "uid": state.userId,
              "avatar": "https://data.cometchat.com/assets/images/avatars/ironman.png",
            }
          } as IMessage;

          action.updateMessageList(newUserMessage);
          // send post request
          const res = axios
            .post(`https://chitchat-ai-backend.onrender.com/send-message`, 
            {
              "user_id": state.userId,
              "model_id": state.curImageId.toString(),
              "message": mes
              })
            .then((response) => {
              // console.log("new join-chat response", response.data)
              const message = response.data.message;
              const uID:string = response.data.user_id;
              const mID:string = response.data.model_id;
              const mIDNumber: number = +mID;
              const receivedMessage =
                {
                  "text": message,
                  "id": mID,
                  "sender": {
                    "name": state.images[mIDNumber].name,
                    "uid": uID,
                    "avatar": state.images[mIDNumber].src,
                  }
                } as IMessage;
              
              action.updateMessageList(receivedMessage);
            })
            .catch((err) => console.log(err));
        }} />
  )
};

export default ChatBox