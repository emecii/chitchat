import React, { useEffect, useState } from 'react'
import MDSpinner from 'react-md-spinner';
import './style.css';
import emptyChatImage from '../../assets/empty-state.svg';
import { User } from '../../types/User';
import { RenderMessageFunction } from '../../types/RenderMessageFunction';
import { If } from '../../app/If';
import { IMessage } from '../../types/IMessage';
import { MessageListDetail } from './MessageListDetail';
import { usePkSystemHook } from '../../state/pk-system-hook';

interface Props {
    isLoading: boolean;
    messages: IMessage[];
    user: User;
    pageRef: React.Ref<HTMLDivElement>
    //renderMessage?: RenderMessageFunction;
}

export const MessageList = ({ isLoading, messages, user, pageRef }: Props) => {
    const [state, action] = usePkSystemHook();
    var console = require("console-browserify")
    return (
        <>
            <If condition={action.isModelSelected() === false}>
                <div className='text-center img-fluid empty-chat'>
                    <div className='empty-chat-holder'>
                        <img src={emptyChatImage} className='img-res' alt='empty chat' />
                    </div>

                    <div>
                        <h2> 你好欢迎使用七洽 </h2>
                        <h6 className='empty-chat-sub-title'>
                            先去洽洽页面选一个你喜欢的伴侣吧~
                        </h6>
                    </div>
                </div>
            </If>
            <If condition={!isLoading && messages.length > 0}>
                <MessageListDetail user={user} messages={messages} pageRef={pageRef}/>
            </If>
            <If condition={action.isModelSelected() === true && isLoading}>
                <div className='loading-messages-container'>
                    <MDSpinner size={100} />
                    <span className='loading-text'>{state.curModelName}正在赶来的路上(*^▽^*)</span>
                </div>
            </If>
            
        </>
    )
};