import React, { lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import Loading from '../../app/Loading';
import Navbar from '../../app/Navbar';
import backgroundJPG from '../../assets/BGIWithCharacterCompressed.jpg';

const TypeWriterText = lazy(() => import('../../app/TypeWriterText'));

const Section = styled.section`
  min-height: ${(props) => `calc(110vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background: url(${backgroundJPG}) no-repeat center center;
  background-size: cover;
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
      margin-top: 2rem;
    }
  }
`;
const Box = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const rotate = keyframes`
100%{
  transform: rotate(1turn);
}
`;

const Cover = () => {
  return (
    <Section id="home">
      <Navbar />
      <Container>
        <Box>
          <Suspense fallback={<Loading />}>
            <TypeWriterText />
          </Suspense>
        </Box>
      </Container>
    </Section>
  );
};

export default Cover;
