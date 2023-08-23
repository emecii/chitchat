import React, { useState, useRef, useEffect, FormEvent } from 'react';
import PropTypes from 'prop-types';
import { MessageList } from './MessageList';
// import SendMessageForm from '../SendMessageForm/SendMessageForm';
import { IMessage } from '../../types/IMessage';
import './style.css';
import { usePkSystemHook } from '../../state/pk-system-hook';
import { If } from '../../app/If';
import sendIcon from '../../assets/send-icon.svg';
import { AppUser } from '../../state/pk-system-state';

interface Props {
  messages: IMessage[];
  isLoading: boolean;
  isBotTyping: boolean;
  user: AppUser;
  onSubmit: (mes: string) => void;
  pageRef: React.Ref<HTMLDivElement>;
}
var console = require('console-browserify');

export const Chat = ({
  messages,
  isLoading,
  isBotTyping,
  user,
  onSubmit,
  pageRef,
}: Props) => {
  const scrollToDiv = useRef<HTMLDivElement>(null);
  const [state, action] = usePkSystemHook();
  const [message, setMessage] = useState('');

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollToDiv.current)
        scrollToDiv.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messageList, state.user.id]);
  return (
    <div className="chat-box">
      <div className="msg-page">
        <MessageList
          isLoading={isLoading}
          messages={messages}
          isBotTyping={isBotTyping}
          user={user}
          pageRef={pageRef}
        />
        <div className="chat-box-bottom" ref={scrollToDiv}>
          <div id="end-of-chat"></div>
        </div>
      </div>
      <div className="msg-footer">
        <form
          className="message-form"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            onSubmit(message);
            setMessage('');
          }}
        >
          <If condition={action.isModelSelected() === true}>
            <div className="input-group">
              <input
                type="text"
                className="form-control message-input"
                placeholder="在这里输入"
                value={message}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMessage(event.target.value);
                }}
                required
              />
              <button className="send-button" type="submit">
                <img className="svg-icon" src={sendIcon} alt="send" />
              </button>
            </div>
          </If>
        </form>
      </div>
    </div>
  );
};
