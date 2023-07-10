import React, { useState } from 'react';
import { Input, DatePicker, Button, Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';
import dayjs, { Dayjs } from 'dayjs';
import GenderType from '../../../types/GenderType';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const FormItem = styled.div`
  margin-bottom: 16px;
`;

interface ProfileUpdateProps {
  user_id: string;
  username: string;
  birthday: Date;
  gender: GenderType;
  phoneNumber: string;
}

const ProfileUpdatePage: React.FC<ProfileUpdateProps> = ({
  user_id,
  username,
  birthday,
  gender,
  phoneNumber,
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderType>(gender);

  // TODO no state from previous page (App or Navbar I forgot) yet.
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle username change
  };

  const handleBirthdayChange = (date: Dayjs | null, dateString: string) => {
    // Handle birthday change
  };

  const handleGenderChange = (e: RadioChangeEvent) => {
    setSelectedGender(e.target.value as GenderType);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle phone number change
  };

  const handleFormSubmit = () => {
    // Talk to backend to update profile
    // Show banner if the update succeeded / failed.
  };

  const dayjsBirthday = dayjs(birthday);

  return (
    <FormContainer>
      <h1>信息更新</h1>
      <FormItem>
        <label>昵称:</label>
        <Input value={username} onChange={handleUsernameChange} />
      </FormItem>
      <FormItem>
        <label>生日:</label>
        <DatePicker value={dayjsBirthday} onChange={handleBirthdayChange} />
      </FormItem>
      <FormItem>
        <label>性别:</label>
        <div>
          <Radio.Group value={selectedGender} onChange={handleGenderChange}>
            <Radio value={GenderType.MALE}>男</Radio>
            <Radio value={GenderType.FEMALE}>女</Radio>
            <Radio value={GenderType.OTHER}>保密</Radio>
          </Radio.Group>
        </div>
      </FormItem>
      <FormItem>
        <label>手机号:</label>
        <Input value={phoneNumber} onChange={handlePhoneNumberChange} />
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={handleFormSubmit}>
          更新
        </Button>
      </FormItem>
    </FormContainer>
  );
};

export default ProfileUpdatePage;
