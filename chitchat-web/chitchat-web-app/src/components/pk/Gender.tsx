import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { pkSystemApi, usePkSystemHook } from "../../state/pk-system-hook";
import "@fontsource/zcool-kuaile";

interface Props {
  userId: string;
}

var console = require("console-browserify");

const Title = styled.h1`
  text-transform: uppercase;
  font-family: "ZCOOL KuaiLe", sans-serif;
`;

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 64em) {
    width: 85%;
  }
  @media (max-width: 48em) {
    flex-direction: column-reverse;
    width: 100%;
    & > *:first-child {
      width: 100%;
      margin-top: 0rem;
    }
  }
`;

const HeartButton = styled.div`
  margin-top: 0;
  margin-left: 250px;
  position: relative;
  width: 100px;
  height: 90px;
  &:before,
  &:after {
    position: absolute;
    content: "";
    left: 50px;
    top: 0;
    width: 50px;
    height: 80px;
    background: #ca8888;
    border-radius: 50px 50px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }
  &:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
  &:hover::after {
    cursor: pointer;
  }
`;
const heartBeat = keyframes`
  0%
  {
    transform: scale( .75 );
  }
  20%
  {
    transform: scale( 1.1 );
  }
  40%
  {
    transform: scale( .75 );
  }
  60%
  {
    transform: scale( 1.1 );
  }
  80%
  {
    transform: scale( .75 );
  }
  100%
  {
    transform: scale( .75 );
  }
`;

const AnimatedHeart = styled(HeartButton)`
  animation: ${heartBeat} 1s infinite;
`;

const Gender: React.FC<Props> = () => {
  // import hooks
  const [state, action] = usePkSystemHook();

  useEffect(() => {}, [state.curImageId]);
  return (
    <Section id="home">
      <Title>选择要匹配的性别</Title>

      <>BOY</>
      <>Girl</>
    </Section>
  );
};
{
  /* <Container>
{}
</Container> */
}
export default Gender;
