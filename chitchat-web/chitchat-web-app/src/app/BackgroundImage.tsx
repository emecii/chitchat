import React from 'react';
import styled from 'styled-components';
import backgroundJPG from '../assets/BGIWithoutCharacterCompressed.jpg';

const Image = styled.div`
  min-height: ${(props) => `calc(110vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: absolute;
  background: url(${backgroundJPG}) no-repeat center center;
  background-size: cover;
`;

const BackgroundImage: React.FC = () => {
  return <Image />;
};

export default BackgroundImage;
