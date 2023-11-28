import React from 'react';
import styled from 'styled-components';

const NotFoundImage =
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMzMyM3wwfDF8c2VhcmNofDF8fHx8fHx8fHwxNjEyMTA5MDk4&ixlib=rb-1.2.1&q=80&w=400'; // 示例图片链接，您可以替换为您喜欢的图片

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
`;

const NotFound = () => {
  return (
    <Container>
      <Image src={NotFoundImage} alt="Not Found" />
      <Title>404：找不到页面</Title>
      <Subtitle>抱歉，您要查找的页面不存在。</Subtitle>
    </Container>
  );
};

export default NotFound;
