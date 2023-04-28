import React, { useEffect, useRef, useState } from 'react'
import { pkSystemApi, usePkSystemHook } from '../../state/pk-system-hook';
import { IMessage } from '../../types/IMessage';
import { User } from '../../types/User';
import { Chat } from './Chat';
import axios from 'axios';
import { ENDPOINT } from '../../types/Env';
import { ModelList } from './ChatSideBar';
import { Model } from '../../types/Model';

interface Props {
  userId: string;
}

const MockUser1 =
  {
    name: "Jackfdweo2134183",
    avatar: "",
    uid: "01",
  } as User

const MockModel1 =
  {
    model_name: "Jack",
    model_metadata: {
      image_url: "https://s2.loli.net/2023/03/25/JjnqHlgpFrEaN97.png"
    },
    _id: "eee",
    model_id: "ssss",
  } as Model

var console = require("console-browserify")

const ChatBox: React.FC<Props> = () => {
  // Add state for the current model and modes list
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  // Fetch models here, for now, I will use a mock model list
  useEffect(() => {
    setModels([MockModel1, MockModel1, MockModel1]);
    setCurrentModel(MockModel1);
  }, []);

  // Handle user click event
  const handleUserClick = (model: Model) => {
    setCurrentModel(model);
  };
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
    <div chat-container>
      <ModelList models={models} onUserClick={handleUserClick} />
      {currentModel && (
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
                  "avatar": "https://s2.loli.net/2023/03/25/JjnqHlgpFrEaN97.png",
                }
              } as IMessage;

              action.updateMessageList(newUserMessage);
              // send post request
              axios
                .post(`${ENDPOINT}/send-message`,
                  {
                    "user_id": state.userId,
                    "model_id": state.curImageId.toString(),
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
                })
                .catch((err) => console.log(err));
            }}
        />
      )}
    </div>
  );
}

export default ChatBox