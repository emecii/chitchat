import React, {useState } from 'react'
import MDSpinner from 'react-md-spinner';
import './style.css';
import emptyChatImage from '../../assets/empty-state.svg';
import { If } from '../../app/If';
import { IMessage } from '../../types/IMessage';
import { MessageListDetail } from './MessageListDetail';
import { usePkSystemHook } from '../../state/pk-system-hook';
import { useParams } from 'react-router-dom';
import { AppUser } from '../../state/pk-system-state';

interface Props {
    isBotTyping: boolean;
    isLoading: boolean;
    messages: IMessage[];
    user: AppUser;
    pageRef: React.Ref<HTMLDivElement>
    //renderMessage?: RenderMessageFunction;
}

export const MessageList = ({ isBotTyping, isLoading, messages, user, pageRef }: Props) => {
    const [state, action] = usePkSystemHook();
    const { modelIdLink } = useParams();
    const [swichingRole, setSwichingRole] = useState(false);
    var console = require("console-browserify") 
    // if(state.messageList[0] !== undefined){
    //     console.log("MessageList modelIdLink messageList",modelIdLink !==state.messageList[0].id)
    //     if(modelIdLink !==state.messageList[0].id) {
    //         setSwichingRole(true);
    //         console.log("setSwichingRole", swichingRole)
    //     }
    //     else {
    //         setSwichingRole(false);
    //         console.log("setSwichingRole", swichingRole)
    //     }
    // }
    return (
        <>
            <If condition={action.isModelSelected() === false}>
                <div className='text-center img-fluid empty-chat'>
                    <div className='empty-chat-holder'>
                        <img src={emptyChatImage} className='img-res' alt='empty chat' />
                    </div>

                    <div>
                        <h2> 你好欢迎使用柒洽 </h2>
                        <h6 className='empty-chat-sub-title'>
                            先去洽洽页面选一个你喜欢的伴侣吧~
                        </h6>
                    </div>
                </div>
            </If>
            <If condition={state.messageList[0] !== undefined && modelIdLink === state.messageList[0].id && !isLoading && messages.length > 0}>
                <MessageListDetail user={user} isBotTyping={isBotTyping} messages={messages} pageRef={pageRef}/>
            </If>
            <If condition={(action.isModelSelected() === true && isLoading) || (state.messageList[0] !== undefined && modelIdLink !== state.messageList[0].id)}>
                <div className='loading-messages-container'>
                    <MDSpinner size={100} />
                    <span className='loading-text'>{state.curModelName}正在赶来的路上(*^▽^*)</span>
                </div>
            </If> 
        </>
    )
};