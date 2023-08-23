import React from 'react';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
import Button from './Button';
import '@fontsource/zcool-kuaile';
import { Link } from 'react-router-dom';
import BlueButton from './BlueButton';

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  width: 80%;
  font-family: 'ZCOOL KuaiLe', sans-serif;
  color: ${(props) => props.theme.text};
  align-self: flex-start;

  span {
    text-transform: uppercase;
    font-family: 'ZCOOL KuaiLe', sans-serif;
  }
  .text-1 {
    color: blue;
  }
  .text-2 {
    color: orange;
  }
  .text-3 {
    color: red;
  }
  .text-4 {
    color: white;
  }

  @media (max-width: 70em) {
    font-size: ${(props) => props.theme.fontxl};
  }
  @media (max-width: 48em) {
    align-self: center;
    text-align: center;
  }
  @media (max-width: 40em) {
    width: 90%;
  }
`;
const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  text-transform: capitalize;
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.6)`};
  font-weight: 600;
  margin-bottom: 1rem;
  width: 80%;
  align-self: flex-start;

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
  }

  @media (max-width: 48em) {
    align-self: center;
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  margin-top: 20px;
  align-self: flex-start;

  @media (max-width: 48em) {
    align-self: center;
    text-align: center;

    button {
      margin: 0 auto;
    }
  }
`;
const TypeWriterText = () => {
  return (
    <>
      <Title>
        柒洽相伴·洽好遇见你
        <Typewriter
          options={{
            autoStart: true,
            loop: true,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(
                `<span class="text-4">聊天陪伴</span><span class="text-1">新纪元!</span>`,
              )
              .pauseFor(2000)
              .deleteAll()
              .typeString(
                `<span class="text-4"></span>个性化<span class="text-2">虚拟伴侣!</span>`,
              )
              .pauseFor(2000)
              .deleteAll()
              .typeString(
                `<span class="text-4"></span>最懂你<span class="text-2">的AI伴侣!</span>`,
              )
              .pauseFor(2000)
              .deleteAll()
              .start();
          }}
        />
      </Title>
      {/* <SubTitle>AI爱情新纪元？体验独一无二的陪伴</SubTitle> */}
      <ButtonContainer>
        <Link to={'/forum'}>
          <BlueButton text="开始探索 ->" />
        </Link>
      </ButtonContainer>
    </>
  );
};

export default TypeWriterText;
