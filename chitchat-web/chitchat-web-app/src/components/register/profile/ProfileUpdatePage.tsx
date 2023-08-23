import React, { useState } from 'react';
import {
  Input,
  DatePicker,
  Button,
  Radio,
  RadioChangeEvent,
  Row,
  Col,
  Card,
  Form,
  Modal,
  List,
  message,
} from 'antd';
import styled from 'styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { usePkSystemHook } from '../../../state/pk-system-hook';
import axios from 'axios';
import GenderType from '../../../types/GenderType';
import { ENDPOINT } from '../../../types/Env';
import { HttpStatus } from '../../../types/HttpStatus';
import { validateUserProfile } from '../../../util/validate';

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
  const [state, action] = usePkSystemHook();
  const [selectedGender, setSelectedGender] = useState<GenderType>(gender);
  const [usernameState, setProfileUsername] = useState(username);
  const [birthdayState, setProfileBirthday] = useState<Date>(birthday);
  const [phoneNumberState, setProfilePhoneNumber] = useState(phoneNumber);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidationErrorModalVisible, setIsValidationErrorModalVisible] =
    useState(false);

  // TODO no state from previous page (App or Navbar I forgot) yet.
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileUsername(e.target.value);
  };

  // TODO: Add date validation.
  const handleBirthdayChange = (date: Dayjs | null, dateString: string) => {
    if (date != null) {
      setProfileBirthday(date.toDate());
    }
  };

  const handleGenderChange = (e: RadioChangeEvent) => {
    setSelectedGender(e.target.value as GenderType);
  };
  // TODO: Add phone validation.
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfilePhoneNumber(e.target.value);
  };
  const dayjsBirthday = dayjs(birthdayState);

  const handleFormSubmit = async () => {
    // TODO: add the mbti and user tags as well
    const userProfile = {
      user_id: state.user.id,
      user_name: usernameState,
      gender: selectedGender,
      birthday: birthdayState,
      phone: phoneNumberState,
      profile_url: state.user.profile.avatar,
    };

    const validationErrors = await validateUserProfile(userProfile);

    if (Object.keys(validationErrors).length > 0) {
      // TODO: show error message on front end and ask User to input again.
      setErrors(Object.values(validationErrors));
      setIsValidationErrorModalVisible(true); // Show the modal
      return;
    }
    await axios
      .post(`${ENDPOINT}/api/update-user-profile`, {
        user_id: userProfile.user_id,
        user_name: userProfile.user_name,
        gender: userProfile.gender,
        birthday: userProfile.birthday,
        phone: userProfile.phone,
        profile_url: userProfile.profile_url,
      })
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          message.info('修改成功!');
        } else {
          message.error('修改失败，请稍后重试或添加下方微信群联系管理员。');
        }
      })
      .catch((err) => {
        message.error(
          '未知原因, 请检查您的输入并重试。若仍然失败，请添加下方微信群联系管理员。',
          err,
        );
        console.error(err);
      });
  };

  const WhiteText = styled.div`
    color: #ffffff;
  `;
  const genderOptions = [
    { label: <WhiteText>男</WhiteText>, value: 'M' },
    { label: <WhiteText>女</WhiteText>, value: 'F' },
    { label: <WhiteText>保密</WhiteText>, value: 'U' },
  ];

  return (
    <Row align="middle" style={{ margin: '5em' }}>
      <Col span={12} offset={6}>
        <Card
          bordered={false}
          title={<div style={{ textAlign: 'center' }}>信息更新</div>}
          headStyle={{
            backgroundColor: '#ff6791',
            color: '#ffffff',
          }}
          bodyStyle={{ backgroundColor: '#1d1f66' }}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Form.Item label="昵称">
              <div style={{ margin: '10px' }} />
              <Input value={usernameState} onChange={handleUsernameChange} />
            </Form.Item>
            <Form.Item label="生日">
              <div style={{ margin: '10px' }} />
              <DatePicker
                value={dayjsBirthday}
                onChange={handleBirthdayChange}
              />
            </Form.Item>
            <Form.Item label="性别">
              <div style={{ margin: '15px' }} />
              <Radio.Group
                value={selectedGender}
                onChange={handleGenderChange}
                options={genderOptions}
              />
            </Form.Item>
            <Form.Item label="手机号码">
              <div style={{ margin: '10px' }} />
              <Input
                value={phoneNumberState}
                onChange={handlePhoneNumberChange}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type="primary" onClick={handleFormSubmit}>
                更新
              </Button>
              <Modal
                title="错误的用户信息"
                cancelButtonProps={{ style: { display: 'none' } }}
                open={isValidationErrorModalVisible}
                onOk={() => setIsValidationErrorModalVisible(false)}
              >
                <List
                  bordered
                  dataSource={errors}
                  renderItem={(error) => <List.Item>{error}</List.Item>}
                />
              </Modal>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileUpdatePage;
