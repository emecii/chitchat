import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePkSystemHook } from '../../state/pk-system-hook';
import { ENDPOINT } from '../../types/Env';
import GenderType from '../../types/GenderType';
import { HttpStatus } from '../../types/HttpStatus';
import { ModelAvatar } from '../../types/ModelAvatar';
import { User } from '../../types/User';
import { fetchModelSrcsByModelIds } from '../../util/fetchModelByModelIds';
import { useRedirectToNewPage } from '../../util/redirectToNewPage';
import { useParams } from 'react-router-dom';

const ChatHeaderWrapper = styled.section`
  margin: 0rem 3rem 1rem 5rem;
  background-color: #e9d6d6;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  overflow-x: auto;

  @media (max-width: 60em) {
    margin: 0rem 1rem 1rem 1rem;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  cursor: pointer;
  border: 2px solid #ffffff;
`;

const FORUM_URL = `/forum`;

const PlusOneIcon =
    {
        avatarSrc: "https://chichat-images-1317940514.cos.ap-nanjing.myqcloud.com/static/WechatIMG4579.jpg",
        modelId: FORUM_URL, // this is not an model id, but let's consider it as a model here
    } as ModelAvatar

const ChatHeader: React.FC = () => {
    const [state, action] = usePkSystemHook();
    const [avatarList, setAvatarList] = useState<ModelAvatar[]>([]);
    const redirectToNewPage = useRedirectToNewPage();
    const { modelIdLink } = useParams();

    const handleAvatarClick = (modelId: string) => {
        // handle the PlusOne icon, which will jump to forum page
        if (modelId === FORUM_URL) {
            redirectToNewPage(FORUM_URL);
        }
        else {
            const CHAT_URL = `/chat/${modelId}`;
            redirectToNewPage(CHAT_URL);
        }
    };

    useEffect(() => {
        const fetchChatHeaderData = async () => {
            // By default, we fetch all the public models.
            console.log("ChatHeader - user name", state.userName);
            // if (state.curUserName === "User") {
            //     await action.fetchUserProfile(GenderType.UNKNOWN, "未命名");
            // }
            console.log("ChatHeader - user id", state.userId);
            await axios
                .get(`${ENDPOINT}/api/chat-models`,
                    {
                        params: {
                            user_id: state.userId,
                        }
                    })
                .then(async (response) => {
                    console.log("ChatHeader - fetchModelProfile", response)
                    if (response.status === HttpStatus.OK) {
                        let activeModelIdArray = response.data.data as string[];

                        // Check if activeModelIdArray exists and if modelIdLink is not the first element.
                        if (modelIdLink && (!activeModelIdArray || activeModelIdArray[0] !== modelIdLink)) {
                            // Add modelIdLink to activeModelIdArray and set it as the first element.
                            activeModelIdArray = [modelIdLink].concat(activeModelIdArray.filter(id => id !== modelIdLink));
                        }

                        const avatarList: ModelAvatar[] = await fetchModelSrcsByModelIds(activeModelIdArray);
                        setAvatarList(avatarList);
                    }
                    else {
                        message.error("页面错误，请刷新重试")
                        console.log("fetchModelProfile response failed", response)
                    }
                })
                .catch((err) => {
                    message.error("页面错误，请刷新重试");
                    console.log(err)
                });

        };
        fetchChatHeaderData();
    }, [modelIdLink, state.userId, state.userName]);
    return (
        <ChatHeaderWrapper>
            {[...avatarList, PlusOneIcon].map((model, index) => (
                <Avatar
                    key={`${model.modelId}-${index}`}
                    src={model.avatarSrc}
                    onClick={() => handleAvatarClick(model.modelId)}
                    alt={"avatar"}
                />
            ))}

        </ChatHeaderWrapper>
    );
};

export default ChatHeader;
