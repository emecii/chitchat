import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import MBTISurveyComponent from './mbti/MBTISurveyComponent';
import MBTIComponent from './mbti/MBTIComponent';
import UserTagSelection from './userTag/UserTagSelection';
import AvatarSelection from './avatar/AvatarSelction';
import GenericCollection from './profile/GenericCollection';
import GenderCollection from './profile/GenderCollection';
import { usePkSystemHook } from '../../state/pk-system-hook';
import GenderType from '../../types/GenderType';
import axios from 'axios';
import { ENDPOINT } from '../../types/Env';
import { List, message, Modal } from 'antd';
import { HttpStatus } from '../../types/HttpStatus';
import { validateUserProfile } from '../../util/validate';
import { useRedirectToNewPage } from '../../util/redirectToNewPage';

interface MBTISurveyComponentProps {
  onMBTITypeChange: (value: string) => void;
}

interface MBTIComponentWrapperProps {
  question: string;
  options: string[];
  onOptionSelect: (option: number) => void;
}

const MBTIComponentWrapper: React.FC<MBTIComponentWrapperProps> = ({
  question,
  options,
  onOptionSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState(0);

  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
    onOptionSelect(option);
  };

  return (
    <MBTIComponent
      question={question}
      option1={options[0]}
      option2={options[1]}
      selectedOption={selectedOption}
      onOptionSelect={handleOptionSelect}
    />
  );
};

const RegisterWizard: React.FC = () => {
  const [state, action] = usePkSystemHook();
  const [errors, setErrors] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [gender, setGender] = useState(GenderType.UNKNOWN);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [mbtiType, setMBTIType] = useState('IDK');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  // TODO: post the selectedTags to backend
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const questionsScores = [1, 2, 4, 8];
  const mbtiQuestions = [
    '和一群人party一天后',
    '晚上看完抽象艺术展回家',
    '刷到乞讨老人的视频',
    '当接到一项工作/任务时',
  ];
  const mbtiOptions = [
    ['救命！急需独处回血！', '明天咱还能聚一回吗'], //I, E
    ['满脑子想法乱窜到后半夜', '呀！困了...睡'], // N, S
    ['从他怎么了联想到天下苍生', '世界就是这样默默滑过'], // F, T
    ['马上开始行动计划', '卧敲！明天要交？'], // J, P
  ];
  // Used for map mbtiScore to mbtiType
  const mbtiMap: Map<number, string> = new Map([
    [0, 'INFJ'], // 0000
    [1, 'INFP'], // 0001
    [2, 'INTJ'], // 0010
    [3, 'INTP'], // 0011
    [4, 'ISFJ'], // 0100
    [5, 'ISFP'], // 0101
    [6, 'ISTJ'], // 0110
    [7, 'ISTP'], // 0111
    [8, 'ENFJ'], // 1000
    [9, 'ENFP'], // 1001
    [10, 'ENTJ'], // 1010
    [11, 'ENTP'], // 1011
    [12, 'ESFJ'], // 1100
    [13, 'ESFP'], // 1101
    [14, 'ESTJ'], // 1110
    [15, 'ESTP'], // 1111
  ]);
  const handleUsernameChange = (username: string) => {
    setUsername(username);
  };
  const handleDOBChange = (dob: Date) => {
    setDOB(dob);
  };
  const handleGenderChange = (gender: GenderType) => {
    setGender(gender);
  };
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  };
  const handleAvatarUrlChange = (avatarUrl: string) => {
    setAvatarUrl(avatarUrl);
  };

  const mbtiScore = selectedOptions.reduce((accumulator, current, index) => {
    return accumulator + current * questionsScores[index];
  }, 0);

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleOptionClick = (questionIndex: number, option: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const nextXSteps = (x: number) => {
    setCurrentStep(currentStep + x);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const prevXStep = (x: number) => {
    setCurrentStep(currentStep - x);
  };

  const emptySubmit = () => {};

  const usernameSubmit = () => {
    username && action.setProfileNickname(username);
  };

  const birthdaySubmit = () => {
    dob && action.setProfileBirthday(dob);
  };

  const genderSubmit = () => {
    gender && action.setProfileGender(gender);
  };

  const phoneNumberSubmit = () => {
    phoneNumber && action.setProfilePhoneNumber(phoneNumber);
  };

  const avatarUrlSubmit = () => {
    avatarUrl && action.setProfileAvatar(avatarUrl);
  };

  const mbtiSubmit = () => {
    mbtiScore && action.setProfileMbtiScore(mbtiScore);
  };

  const selectedTagsSubmit = () => {
    selectedTags && action.setProfileSelectedTags(selectedTags);
  };

  const redirectToNewPage = useRedirectToNewPage();

  const profileSubmit = async () => {
    // TODO: add the mbti and user tags as well
    const userProfile = {
      user_id: state.user.id,
      user_name: state.user.profile.username,
      gender: state.user.profile.gender,
      birthday: state.user.profile.birthday,
      phone: state.user.profile.phoneNumber,
      profile_url: state.user.profile.avatar,
    };

    const validationErrors = await validateUserProfile(userProfile);
    if (Object.keys(validationErrors).length > 0) {
      // TODO: show error message on front end and ask User to input again.
      setErrors(Object.values(validationErrors));
      setIsModalVisible(true); // Show the modal
      return;
    }
    await axios
      .post(`${ENDPOINT}/api/user-profile`, {
        user_id: state.user.id,
        user_name: state.user.profile.username,
        gender: state.user.profile.gender,
        birthday: state.user.profile.birthday,
        // city: state.user.profile.birthday, //TODO: add back city if needed
        phone: state.user.profile.phoneNumber,
        profile_url: state.user.profile.avatar,
      })
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          message.info('注册成功!');
        } else {
          message.error('页面错误，请稍后重试或添加下方微信群联系管理员。');
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          // handle conflict error here
          message.error('用户已存在,请稍后重试或添加下方微信群联系管理员。');
        } else {
          console.error(err);
        }
      });
    let mbtiString = mbtiType;
    if (mbtiType === 'IDK') {
      if (mbtiMap.has(mbtiScore)) {
        mbtiString = mbtiMap.get(mbtiScore)!;
      } else {
        console.error('mbtiScore not found in mbtiMap, score is', mbtiScore);
      }
    }
    await axios.post(`${ENDPOINT}/api/upsert-user-tags`, {
      user_id: state.user.id,
      user_tags: selectedTags,
      user_mbti_tag: mbtiString,
    });
    // Jump to login page
    redirectToNewPage('/login');
  };

  return (
    <div>
      {currentStep === 0 && (
        <ProfileCard
          headline="昵称"
          progressBarPercent={8}
          onNext={nextStep}
          onSubmit={usernameSubmit}
          onPrevious={prevStep}
          isAllowGoBack={false}
        >
          <GenericCollection
            inputType="text"
            value={username}
            onInputChange={handleUsernameChange}
          />
        </ProfileCard>
      )}
      {currentStep === 1 && (
        <ProfileCard
          headline="生日"
          progressBarPercent={16}
          onNext={nextStep}
          onSubmit={birthdaySubmit}
          onPrevious={prevStep}
        >
          <GenericCollection
            inputType="date"
            value={dob}
            onInputChange={handleDOBChange}
          />
        </ProfileCard>
      )}
      {currentStep === 2 && (
        <ProfileCard
          headline="性别"
          progressBarPercent={24}
          onNext={nextStep}
          onSubmit={genderSubmit}
          onPrevious={prevStep}
        >
          <GenderCollection
            selectedOption={gender}
            onSelectOption={handleGenderChange}
          />
        </ProfileCard>
      )}
      {currentStep === 3 && (
        <ProfileCard
          headline="手机号"
          progressBarPercent={30}
          onNext={nextStep}
          onSubmit={phoneNumberSubmit}
          onPrevious={prevStep}
        >
          <div style={{ marginBottom: '10px' }}>
            手机号将用于登录，所以请确保输入正确无误。目前仅支持中国手机号。
          </div>
          <GenericCollection
            value={phoneNumber}
            inputType="text"
            onInputChange={handlePhoneNumberChange}
          />
        </ProfileCard>
      )}
      {currentStep === 4 && (
        <ProfileCard
          headline="选头像"
          progressBarPercent={35}
          onNext={nextStep}
          onSubmit={avatarUrlSubmit}
          onPrevious={prevStep}
        >
          <AvatarSelection
            selectedAvatar={avatarUrl}
            onSelectAvatar={handleAvatarUrlChange}
          />
        </ProfileCard>
      )}
      {currentStep === 5 && (
        <ProfileCard
          headline="MBTI 小调查"
          progressBarPercent={40}
          onNext={() => {
            if (mbtiType === 'IDK') {
              nextStep();
            } else {
              nextXSteps(5);
            }
          }}
          onSubmit={mbtiSubmit}
          onPrevious={prevStep}
        >
          <MBTISurveyComponent
            onMBTITypeChange={setMBTIType}
          ></MBTISurveyComponent>
        </ProfileCard>
      )}
      {currentStep >= 6 && currentStep <= 9 && (
        <ProfileCard
          headline="MBTI 小调查"
          progressBarPercent={40 + (currentStep - 6) * 8}
          onNext={nextStep}
          onSubmit={mbtiSubmit}
          onPrevious={prevStep}
        >
          <MBTIComponentWrapper
            question={mbtiQuestions[currentStep - 6]}
            options={mbtiOptions[currentStep - 6]}
            onOptionSelect={handleOptionClick.bind(null, currentStep - 7)}
          />
        </ProfileCard>
      )}
      {currentStep === 10 && (
        <ProfileCard
          headline="请选择最符合你的几项"
          progressBarPercent={85}
          onNext={nextStep}
          onSubmit={selectedTagsSubmit}
          onPrevious={() => {
            if (mbtiType === 'IDK') {
              prevStep();
            } else {
              prevXStep(5);
            }
          }}
        >
          <UserTagSelection onTagsChange={handleTagsChange} />
        </ProfileCard>
      )}
      {currentStep === 11 && (
        <ProfileCard
          headline="即将起航"
          progressBarPercent={100}
          onNext={() => {}}
          onSubmit={profileSubmit}
          onPrevious={prevStep}
        >
          欢迎加入柒洽，快去登录并探索你喜欢的角色吧~
        </ProfileCard>
      )}
      <Modal
        title="请回到上几步修改以下必填信息"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <List
          bordered
          dataSource={errors}
          renderItem={(error) => <List.Item>{error}</List.Item>}
        />
      </Modal>
    </div>
  );
};

export default RegisterWizard;
