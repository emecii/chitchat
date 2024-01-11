import React from 'react';
import styled from 'styled-components';

const FullScreenSection = styled.section`
  height: 100vh; // 视口高度
  width: 100vw; // 视口宽度
  position: fixed; // 固定位置
  top: 0;
  left: 0;
  margin: 0; // 移除外边距
  padding: 0; // 移除内边距
  z-index: 10; // 确保在顶层
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: calc(100% + 60px); // 增加20px高度
  overflow: hidden; // 隐藏超出部分
  frameBorder: 0; // 移除边框
  allowFullScreen; // 允许全屏
`;

const DemoPage = () => {
    return (
        <FullScreenSection>
            <StyledIframe 
                src="https://app.customgpt.ai/projects/16947/ask-me-anything?embed=1&shareable_slug=b7696cc0e51938c154de96728372839f" 
            ></StyledIframe>
        </FullScreenSection>
    );
};

export default DemoPage;
