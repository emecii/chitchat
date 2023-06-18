import React, { FormEvent, Suspense, useState } from 'react'
import styled from 'styled-components'
import Loading from '../../app/Loading';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import "@fontsource/akaya-telivigala"
import { pkSystemApi, usePkSystemHook } from '../../state/pk-system-hook';
import { Model } from '../../types/Model';
import { useRedirectToNewPage } from '../../util/redirectToNewPage';

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

  @media (max-width: 48em) {
    width: 100%;
    height: auto;
  }
`;

const FrameFlipped = styled.div`
  display: inline-block;
  overflow: hidden;
  background-color: #828080;
  margin-bottom: 3rem;
  width: 600px;
  height: 600px;
  border-radius:5%;
  box-shadow:20px 20px 20px #828080;
  position: relative;
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 48em) {
    width: 100%;
  }
`;

const Btn = styled.button`
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  outline: none;
  border: none;
  margin: 3rem;
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
    margin: 0.5rem;
    padding: 0.5rem;
    width: 50%;
  }
`

const ButtonList = styled.section`
position: relative;
border-top: 2px solid ${props => props.theme.text};
display: flex;

@media (max-width: 48em) {
//height: 5rem;
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

var console = require("console-browserify")
export const ImageCard = ({ idCardFlipped, imgOnClick, imgItem }: Props) => {
  console.log("ImageCard imgItem", imgItem);
  const [state, action] = usePkSystemHook();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const imgPrompt = "TBD";
  const modelId = imgItem._id;
  const imgId = imgItem.model_id;
  const imgSrc = imgItem.model_metadata.image_url;
  const imgName = imgItem.model_name;
  const imgAge = imgItem.model_metadata.年龄;
  const imgEducaton = imgItem.model_metadata.职业;
  const imgFigure = imgItem.model_metadata.身材;
  const imgPersonality = imgItem.model_metadata.性格;
  const imgHobby = imgItem.model_metadata.爱好;
  const imgCharacter = imgItem.model_metadata.角色;
  const imgRelationship = imgItem.model_metadata.和我的关系;
  const imgOccupation = imgItem.model_metadata.职业;
  const CHAT_URL = `/chat/${imgId}`;
  const redirectToNewPage = useRedirectToNewPage();
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
                  <Btn onClick={
                    async () => {
                      console.log("calling handleJoinChat:imgId",imgId);
                      //action.handleJoinChat(modelId);
                      // jump to new page
                      redirectToNewPage(CHAT_URL);
                    }}
                  >
                    聊天
                  </Btn>
                <Btn onClick={() => {
                  action.randomPickImageId();
                }}>换人
                </Btn>
            </ButtonList>
          </FrameFlipped>
        </Suspense>
      </Box>
    </ReactCardFlip>
  )
}