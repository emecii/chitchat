import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { BsPlus } from 'react-icons/bs';
import MyBotTagItems from '../../types/MyBotTagItems';
import axios from 'axios';
import { ENDPOINT } from '../../types/Env';
import { usePkSystemHook } from '../../state/pk-system-hook';
import { createRandomUserId } from '../../util/createRandomUserId';
import { genderChineseToRequiredType } from '../../util/genderChineseToRequiredType';
import { HttpStatus } from '../../types/HttpStatus';
import { message, Modal } from 'antd';
import RegisterBlock from '../../app/RegisterBlock';
import { useShareToWechat } from './shareToWeChat';
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px; 
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 10px;
`;

const UploadArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #999;
  border-radius: 5px;
  margin: 20px;

  &:hover {
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom:5px;
  margin-top:5px;
  border-radius: 5px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  color: #666;
  margin-right: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 10px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TagItem = styled.div<{ selected: boolean }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#000" : "#f0f0f0")};
  color: ${(props) => (props.selected ? "#fff" : "#000")};
  margin: 5px;
  cursor: pointer;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 5px;
  border-radius: 5px;
`;

const SwitchContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`;

const SwitchContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
`;

const StyledSwitch = styled.label`
  margin: 10px;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: '';
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #2196f3;
  }

  input:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + span:before {
    transform: translateX(26px);
  }
`;


const StyledButton = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#000" : "#07c160")};
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const StyledRadioButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledRadioButtonLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  margin-right: 10px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const StyledRadioButton = styled.input.attrs({ type: "radio" })`
  display: none;

  &:checked + ${StyledRadioButtonLabel} {
    background-color: #333;
    color: #fff;
  }
`;

const CreateNewBot = () => {
  const [state] = usePkSystemHook();
  const [tags, setTags] = useState(MyBotTagItems);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [aiName, setAiName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [freqChats1, setFreqChats1] = useState('');
  const [freqChats2, setfreqChats2] = useState('');
  const [freqChats3, setfreqChats3] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [hobby, setHobby] = useState('');
  const [age, setAge] = useState('');
  const [otherFeatures, setOtherFeatures] = useState('');
  const [isPublicAiBot, setIsPublicAiBot] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const redirectToChat = (url: string) => {
    // 在这里实现跳转到聊天页面
    navigate(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, userId: string, modelId: string) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        // Upload the image to the backend
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", userId);
        formData.append("model_id", modelId);

  
        const response = await fetch(`${ENDPOINT}/api/upload-image`, {
          method: 'POST',
          body: formData
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload the image');
        }
  
        const result = await response.json();
  
        // Assuming the backend returns the uploaded image URL in the response
        const image_url = result.image_url;
  
        // Add the uploaded image URL to the state
        setUploadedImages([...uploadedImages, image_url]);
      } catch (error) {
        console.error('Error uploading image, please retry.', error);
        // Handle the error accordingly, e.g., show an error message to the user
      }
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const userId = state.userId === "unknown" ? createRandomUserId() : state.userId;
  const modelId = createRandomUserId(); // Generate a random one;
  const url = `${ENDPOINT}/chat/${modelId}`;
  const chat_url = `/chat/${modelId}`;

  const handleSubmit = async () => {
    const modelMetadata = {
      name: aiName,
      gender,
      age,
      occupation,
      personality: selectedTags,
      hobbies: [hobby],
      freq_chats: [freqChats1, freqChats2, freqChats3],
      other_patterns: otherFeatures,
      is_public: isPublicAiBot,
      greetings: greeting,
    };

    console.log("myBot submitting:", modelMetadata);
    console.log("userId", userId)
    console.log("modelId", modelId)
    console.log("api", `${ENDPOINT}/model-profile`)
    try {
      const response = await axios.post(`${ENDPOINT}/model-profile`, {
        user_id: userId,
        model_id: modelId,
        model_name: aiName,
        model_type: genderChineseToRequiredType(gender), // 根据需要Map为'M'或'W'
        model_metadata: modelMetadata,
      });
  
      if (response.status === HttpStatus.OK) {
        message.success("AI角色创建成功");
        if(state.userId) {
          message.success("请及时注册保存当前角色");
        }
        console.log("set modelMetadata succeeded", response.data);
        // show model
        handleModalOpen();
        
      } else {
        message.error("页面错误，请刷新重试");
        console.log("set modelMetadata failed", response);
      }
    } catch (err) {
      message.error("页面错误，请刷新重试");
      console.log(err);
    }
  };
  return (
    <Container>
      <Title>创建我的AI角色</Title>
      {uploadedImages.map((imageUrl, index) => (
        <UploadArea key={index} style={{ backgroundImage: `url(${imageUrl})`,
                                         backgroundSize: 'cover', 
                                         backgroundPosition: 'center', }} />
      ))}
      <UploadArea onClick={() => fileInputRef.current?.click()}>
        <BsPlus size={24} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFileChange(e, userId, modelId)}
        />
      </UploadArea>
      <InputContainer>
        <SectionTitle>名称</SectionTitle>
        <StyledInput
          type="text"
          placeholder="AI名称"
          value={aiName}
          onChange={(e) => setAiName(e.target.value)}
        />
        <StyledLabel>姓名不能重复且在10个字符以内。创建后无法修改。</StyledLabel>
      </InputContainer>

      <InputContainer>
        <SectionTitle>性别</SectionTitle>
        <StyledRadioButtonContainer>
          <StyledRadioButton
            id="male"
            name="gender"
            value="男"
            checked={gender === '男'}
            onChange={() => setGender('男')}
          />
          <StyledRadioButtonLabel htmlFor="male">男</StyledRadioButtonLabel>
          <StyledRadioButton
            id="female"
            name="gender"
            value="女"
            checked={gender === '女'}
            onChange={() => setGender('女')}
          />
          <StyledRadioButtonLabel htmlFor="female">女</StyledRadioButtonLabel>
        </StyledRadioButtonContainer>
      </InputContainer>

      <SectionTitle>性格</SectionTitle>
      <TagsContainer>
        {tags.map((tag, index) => (
          <TagItem
            key={index}
            selected={selectedTags.includes(tag)}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </TagItem>
        ))}

      </TagsContainer>

      <InputContainer>
        <SectionTitle>开局问候语</SectionTitle>
        <StyledInput
          type="text"
          placeholder="开局问候语"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
        />
        <StyledLabel>开始与他人交流时，用来表示友好和礼貌的一句话或短语。</StyledLabel>
      </InputContainer>

      <InputContainer>
        <SectionTitle>聊天口头禅</SectionTitle>
        <StyledInput
          type="text"
          placeholder="聊天口头禅1"
          value={freqChats1}
          onChange={(e) => setFreqChats1(e.target.value)}
        />
        <StyledInput
          type="text"
          placeholder="聊天口头禅2"
          value={freqChats2}
          onChange={(e) => setfreqChats2(e.target.value)}
        />
        <StyledInput
          type="text"
          placeholder="聊天口头禅3"
          value={freqChats3}
          onChange={(e) => setfreqChats3(e.target.value)}
        />
        <StyledLabel>聊天口头禅可以是一些流行语、俚语、惯用语、感叹词或者个人特色的说法。</StyledLabel>
      </InputContainer>


      <FormContainer>
        <InputContainer>
          <SectionTitle>职业</SectionTitle>
          <StyledInput
            type="text"
            placeholder="职业"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </InputContainer>

        <InputContainer>
          <SectionTitle>爱好</SectionTitle>
          <StyledInput
            type="text"
            placeholder="爱好"
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
          />
        </InputContainer>

        <InputContainer>
          <SectionTitle>年龄</SectionTitle>
          <StyledInput
            type="text"
            placeholder="年龄"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </InputContainer>
      </FormContainer>

      <InputContainer>
        <SectionTitle>其他特征</SectionTitle>
        <StyledTextarea value={otherFeatures} onChange={(e) => setOtherFeatures(e.target.value)} />
        <StyledLabel>包括但不限于，癖好：如摆弄手指、喜欢喝咖啡、痴迷音乐等。成长背景：AI角色的家庭背景、教育经历、成长经历等。擅长领域：如编程、绘画、写作、烹饪等。信仰与价值观：AI角色可能有一定的宗教信仰、道德观念、人生观等。</StyledLabel>
      </InputContainer>

      <SwitchContainer>
        <SwitchContainerWrapper>
          <SectionTitle>是否公开此角色</SectionTitle>
          <StyledSwitch>
            <input type="checkbox" checked={isPublicAiBot} onChange={() => setIsPublicAiBot(!isPublicAiBot)} />
            <span></span>
          </StyledSwitch>
        </SwitchContainerWrapper>

        <StyledLabel>公开后其他人可以在探索页面查看</StyledLabel>
      </SwitchContainer>

      <StyledButton primary onClick={handleSubmit}>创建AI</StyledButton>

      
      <Modal
        centered
        title="AI角色创建成功"
        open={isModalOpen}
        footer={null}
        onCancel={handleModalCancel}
      >
        <StyledButton primary onClick={() => redirectToChat(chat_url)}>开始聊天</StyledButton>
        <StyledButton onClick={useShareToWechat(url)}>分享到朋友圈赚取点数</StyledButton>

      </Modal>
                    
    </Container>
  );
};

export default CreateNewBot;