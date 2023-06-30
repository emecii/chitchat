import React, { useState } from 'react';
import styled from 'styled-components';
import { Button as AntdButton, Modal, Progress } from 'antd';
import Button from '../../app/Button';

type Props = {
  headline: string;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  progressBarPercent: number;
  children: React.ReactNode;
  isAllowSkip?: boolean;
  isAllowChanged?: boolean;
};

const ProfileCardWrapper = styled.div`
  border-radius: 17px;
  background: #FFF;
  box-shadow: 0px 4px 10px 0px rgba(82, 61, 255, 0.25);
  max-width: 600px;
  margin: 35px auto;
  padding: 40px;
`;

const NavigationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BackButton = styled.button`
  font-size: 26px;
  padding: 0px;
  border: none;
  background: none;
  cursor: pointer;
`;

const ProgressBar = styled(Progress)`
  margin: 10px;
  .ant-progress-bg {
    background-image: linear-gradient(89deg, #523DFF 0%, #FF679E 100%);
  }
`;

const Headline = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ChildContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const NextButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const ProfileCard: React.FC<Props> = ({ isAllowSkip, isAllowChanged, headline, children, onNext, onPrevious, onSubmit, progressBarPercent }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = () => {
    if (isAllowChanged) {
      setIsModalVisible(true);
    }
    // TODO: Add any further opertaion here
  }

  const handleModalOk = () => {
    setIsModalVisible(false);
    // TODO: Add any further opertaion here
  }

  const handleModalCancel = () => {
    setIsModalVisible(false);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <ProfileCardWrapper>
      <NavigationWrapper>
        <BackButton onClick={() => { onPrevious() }}>&lt;</BackButton>
        <ButtonWrapper>
          {isAllowSkip &&
            <AntdButton
              type="text"
              onClick={() => onNext()}>
              跳过
            </AntdButton>}
        </ButtonWrapper>
      </NavigationWrapper>

      <ProgressBar percent={progressBarPercent} showInfo={false} />

      <Headline>{headline}</Headline>

      <ChildContentWrapper>
        {children}
      </ChildContentWrapper>

      <NextButtonWrapper>
        <Button
          text={"下一步"}
          onClick={
            () => {
              onNext();
              onSubmit();
              handleModalOpen();
              scrollToTop();
            }}
        />
      </NextButtonWrapper>

      {isAllowChanged &&
        <Modal open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} okText={"确认"} cancelText={"取消"}>
          确认后不可更改哦
        </Modal>
      }
    </ProfileCardWrapper>
  );
}

export default ProfileCard;
