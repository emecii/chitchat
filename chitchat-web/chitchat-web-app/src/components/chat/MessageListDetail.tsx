import React, { useEffect, useRef, useState } from 'react'
import { usePkSystemHook } from '../../state/pk-system-hook';
import { IMessage } from '../../types/IMessage';
import "./style.css"
import { LoginUser } from '../../state/pk-system-state';

interface Props {
  messages: { text: string; id: string; sender: LoginUser }[];
  user: LoginUser;
  isBotTyping: boolean;
  pageRef: React.Ref<HTMLDivElement>
}
const isUser = (user: LoginUser, message: IMessage) => {
  return user.id === message.sender.id;
}

const getRenderName = (isUser: boolean, message: IMessage) => {
  let renderName;
  if (isUser) {
    renderName = null;
  } else {
    renderName = <div className='sender-name'>{message.sender.name}</div>;
  }
  return renderName
}
var console = require("console-browserify")
export const MessageListDetail = ({ messages, user, isBotTyping, pageRef }: Props) => {
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [state] = usePkSystemHook();
  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [state.messageList, state.user.id]);
  return (
    <div className='chatSection'>
      {messages.map((message, index) => {
        return (
          <div
            ref={pageRef}
            key={`${message.id}-${index}`}
            className='chat-bubble-row'
            style={{ flexDirection: isUser(user, message) ? 'row-reverse' : 'row' }}>
            <img
              src={message.sender.avatar}
              alt='未命名'
              className='avatar'
              style={isUser(user, message) ? { marginLeft: '15px' } : { marginRight: '15px' }}
            />
            <div className={`chat-bubble ${isUser(user, message) ? 'is-user' : 'is-other'}`}>
              {getRenderName(isUser(user, message), message)}
              <div
                className='message'
                style={{ color: isUser(user, message) ? '#FFF' : '#2D313F' }}>
                {message.text}
              </div>
            </div>
          </div>
        )
      })}
      {isBotTyping &&
        <div className="chat-bubble-row" style={{ flexDirection: 'row' }}>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      }
    </div>
  )
}