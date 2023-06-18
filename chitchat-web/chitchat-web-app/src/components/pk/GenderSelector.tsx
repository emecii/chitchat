import React, { useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import GenderType from '../../types/GenderType';
import { usePkSystemHook } from '../../state/pk-system-hook';
var console = require("console-browserify")

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const GenderButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? '#1890ff' : '#f7f7f7')};
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  margin: 10px;
  padding: 15px;
  cursor: pointer;
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#096dd9' : '#e6f7ff')};
  }
`;

const Label = styled.div`
  text-align: center;
  font-size: 14px;
`;

const NicknameInput = styled.input`
  margin: 20px;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  outline: none;
`;

const SubmitButton = styled.button`
  background-color: #1890ff;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #096dd9;
  }
`;

const GenderSelector: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [state, action] = usePkSystemHook();

  const handleGenderClick = (gender: GenderType) => {
    setSelectedGender(gender);
  };

  const handleSubmit = async () => {
    if (!selectedGender || !nickname) {
      message.error('请选择性别并输入昵称');
    } else {
      // set userName and Gender to state
      action.setUserName(nickname);
      action.setGender(selectedGender);
      // Fetch model-profile
      action.fetchModelProfile(selectedGender);
      // Regisetr user profile
      action.registerNewUserProfile(selectedGender, nickname);
    }
  };

  return (
    <Container>
      <FlexContainer>
        <div>
          <GenderButton
            selected={selectedGender === GenderType.MALE}
            onClick={() => handleGenderClick(GenderType.MALE)}
          >
            ♂
          </GenderButton>
          <Label>男</Label>
        </div>
        <div>
          <GenderButton
            selected={selectedGender === GenderType.FAMALE}
            onClick={() => handleGenderClick(GenderType.FAMALE)}
          >
            ♀
          </GenderButton>
          <Label>女</Label>
        </div>
        <div>
          <GenderButton
            selected={selectedGender === GenderType.OTHER}
            onClick={() => handleGenderClick(GenderType.OTHER)}
          >
            ⚧
          </GenderButton>
          <Label>其他</Label>
        </div>
      </FlexContainer>
      <NicknameInput
        type="text"
        placeholder="请输入你的昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <SubmitButton onClick={handleSubmit}>开始匹配</SubmitButton>
    </Container>
  );
};

export default GenderSelector;
