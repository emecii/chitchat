import React, { FormEvent, Suspense, useState } from 'react'
import styled from 'styled-components'
import Loading from '../../app/Loading';
import ReactCardFlip from 'react-card-flip';
import "@fontsource/akaya-telivigala"
import { pkSystemApi, usePkSystemHook } from '../../state/pk-system-hook';
import { randomIntBetweenZeroAndXButNotY } from '../../util/randomIntBetweenZeroAndX';
import { ImageItem } from '../../types/ImageItem';
import { Link } from 'react-router-dom'
import TinderCard from 'react-tinder-card'
import axios from 'axios';
import { IMessage } from '../../types/IMessage';
import { ChatHistoryItem } from '../../types/ChatHistoryItem';
import { Model } from '../../types/Model';

interface Props {
  idCardFlipped: boolean | undefined,
  imgOnClick: () => void,
  imgItem: Model,
}
const onSwipe = (direction: any) => {
  console.log('You swiped: ' + direction)
}

const onCardLeftScreen = (myIdentifier: any) => {
  console.log(myIdentifier + ' left the screen')
}

const Box = styled.div`
margin: 0rem;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const ImgFrame = styled.img`
  display: inline-block;
  overflow: hidden;
  width: 600px;
  height: 600px;
  border-radius:5%;
  box-shadow:20px 20px 20px #828080;
  position: relative;
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.1);
}
`;

const FrameFlipped = styled.div`
  display: inline-block;
  overflow: hidden;
  background-color: #828080;
  width: 600px;
  height: 600px;
  border-radius:5%;
  box-shadow:20px 20px 20px #828080;
  position: relative;
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.1);
}
`;


const ExploreBtn = styled.button`
  background-color: rgb(226, 118, 118);
  color: ${props => props.theme.body};
  outline: none;
  border: none;
  margin: 2rem;
  margin-left: 15rem;
  font-size: ${props => props.theme.fontmd};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  &:hover{
      transform: scale(0.9);
  }

  &::after{
      content: ' ';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      border: 2px solid rgb(226, 118, 118);
      width: 100%;
      height: 100%;
      border-radius: 50px;
      
      transition: all 0.2s ease;
  }

  &:hover::after{
      transform: translate(-50%, -50%) scale(1);
      padding: 0.3rem;
  }

  @media (max-width: 48em) {
  font-size: ${props => props.theme.fontsm};

  }
`

const Btn = styled.button`
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  outline: none;
  border: none;
  margin: 3rem;
  margin-left: 3rem;
  width: 13rem;
  font-size: ${props => props.theme.fontmd};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  &:hover{
      transform: scale(0.9);
  }

  &::after{
      content: ' ';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      border: 2px solid ${props => props.theme.text};
      width: 100%;
      height: 100%;
      border-radius: 50px;
      
      transition: all 0.2s ease;
  }

  &:hover::after{
      transform: translate(-50%, -50%) scale(1);
      padding: 0.3rem;
  }

  @media (max-width: 48em) {
  font-size: ${props => props.theme.fontsm};

  }
`

const ButtonList = styled.section`
position: relative;
border-top: 2px solid ${props => props.theme.text};
display: flex;


@media (max-width: 48em) {
height: 5rem;
flex-direction: column;
}
`
const ImgInfoSection = styled.div`
  color: #FFFFFF;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  margin: 3rem;
`
const ImgInfoText = styled.p`

`;

const PromptText = styled.p`
  color: #FFFFFF;
  margin: 3rem;
`;


const XButton = styled.button`
  border: none;
  padding-left: 2rem;
  background-color: transparent;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }

  @media only screen and (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }

  @media only screen and (max-width: 480px) {
    width: 25px;
    height: 25px;
    font-size: 14px;
  }
`;

var console = require("console-browserify")
export const ImageCard = ({ idCardFlipped, imgOnClick, imgItem }: Props) => {
  console.log("ImageCard imgItem", imgItem);
  const [state, action] = usePkSystemHook();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const imgPrompt = "TBD";
  const modelId = imgItem._id;
  const imgId = imgItem.model_id;
  const imgSrc = imgItem.model_metadata.头像地址src;
  const imgName = imgItem.model_name;
  const imgAge = imgItem.model_metadata.年龄;
  const imgEducaton = imgItem.model_metadata.职业;
  const imgFigure = imgItem.model_metadata.身材;
  const imgPersonality = imgItem.model_metadata.性格;
  const imgHobby = imgItem.model_metadata.爱好;
  const imgCharacter = imgItem.model_metadata.角色;
  const imgRelationship = imgItem.model_metadata.和我的关系;
  const imgOccupation = imgItem.model_metadata.职业;
  return (
    <ReactCardFlip isFlipped={idCardFlipped}>
      <Box>
        <Suspense fallback={<Loading />}>
          <ImgFrame onClick={imgOnClick} key={imgId} src={imgSrc} width={600} height={600} alt={`PK-${imgId}`} />
        </Suspense>
      </Box>

      <Box>
        <Suspense fallback={<Loading />}>
          <FrameFlipped onClick={imgOnClick}>
            {
              isPromptOpen ?
                <PromptText>提示词: {imgPrompt}</PromptText>
                :
                <ImgInfoSection>
                  <ImgInfoText>姓名: {imgName}</ImgInfoText>
                  <ImgInfoText>角色: {imgCharacter}</ImgInfoText>
                  <ImgInfoText>和我的关系: {imgRelationship}</ImgInfoText>
                  <ImgInfoText>年龄: {imgAge}</ImgInfoText>
                  <ImgInfoText>身材: {imgFigure}</ImgInfoText>
                  <ImgInfoText>学历: {imgEducaton}</ImgInfoText>
                  <ImgInfoText>性格: {imgPersonality}</ImgInfoText>
                  <ImgInfoText>爱好: {imgHobby}</ImgInfoText>
                  <ImgInfoText>职业: {imgOccupation}</ImgInfoText>
                </ImgInfoSection>
            }

            <ButtonList>
              <Link to={"/chat"}>
                <Btn onClick={() => {
                  console.log("Start chatting, user id", state.userId, "model_id", imgId)
                  // update curImage id in state since we will use it on send message post, and convert it to string
                  state.curImageId = +imgId;
                  // update curModel name
                  state.curModelName = imgName;
                  axios
                    .post(`http://chitchat-ai-backend:3000/join-chat`,
                      {
                        "user_id": state.userId,
                        "model_id": imgId
                      }
                    )
                    .then((response) => {
                      let chatHistory:ChatHistoryItem[] = [];
                      if(response.data.chat_history) {
                       chatHistory = response.data.chat_history;
                      }
                      console.log("chatHistory", chatHistory)
                      const message = response.data.message;
                      const uID = response.data.user_id;
                      const mID = response.data.model_id;

                      // Add chat history to messageList
                      chatHistory.map(chat => {
                        const isUser:boolean = chat.is_user;
                        const messageItem = {
                          "text": chat.message,
                          "id": mID,
                          "sender": {
                            "name": isUser ? state.curUserName : state.images[mID].name,
                            "uid": uID,
                            "avatar": isUser ? "https://data.cometchat.com/assets/images/avatars/ironman.png" : state.images[mID].src,
                          }
                        } as IMessage;
                        action.updateMessageList(messageItem);
                      })

                      const initialMessage =
                        {
                          "text": message,
                          "id": mID,
                          "sender": {
                            "name": imgName,
                            "uid": uID,
                            "avatar": imgSrc,
                          }
                        } as IMessage;
                      action.updateMessageList(initialMessage);
                    })
                    .catch((err) => console.log(err));
                }}>
                  开始聊天</Btn>
              </Link>
              <Btn onClick={() => {
                action.randomPickImageId();
              }}>换人</Btn>
            </ButtonList>
          </FrameFlipped>
        </Suspense>
      </Box>
    </ReactCardFlip>
  )
}