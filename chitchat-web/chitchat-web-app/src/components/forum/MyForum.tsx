import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Model } from '../../types/Model';
import axios from 'axios';
import { ENDPOINT } from '../../types/Env';
import { HttpStatus } from '../../types/HttpStatus';
import { message, Modal } from 'antd';
import { useRedirectToNewPage } from '../../util/redirectToNewPage';
const MyForum: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modelsPerPage] = useState(14);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const [modelList, setModelList] = useState<Model[]>([]);
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // By default, we fetch all the public models.
      await axios
        .get(`${ENDPOINT}/api/model-profile`, {
          params: {
            is_public: true,
            gender: genderFilter,
          },
        })
        .then((response) => {
          if (response.status === HttpStatus.OK) {
            const curModelArray = response.data.data as Model[];
            setModelList(curModelArray);
            setTotalPages(Math.ceil(curModelArray.length / modelsPerPage));
          } else {
            message.error('页面错误，请刷新重试');
            console.log('fetchModelProfile response failed', response);
          }
        })
        .catch((err) => {
          message.error('页面错误，请稍后重试或添加下方微信群联系管理员。');
          console.log(err);
        });
    };
    fetchData();
  }, [modelsPerPage, genderFilter]);

  const updateVotes = async (
    model_id: string,
    upVote: number,
    downVote: number,
  ) => {
    await axios.patch(`${ENDPOINT}/api/model-profile/votes`, {
      model_id: model_id,
      upVote: upVote,
      downVote: downVote,
    });
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleVote = async (
    model_id: string,
    isUpvote: boolean,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();

    const upVote = isUpvote ? 1 : 0;
    const downVote = isUpvote ? 0 : 1;
    await updateVotes(model_id, upVote, downVote);

    setModelList((prevModels) =>
      prevModels.map((model) =>
        model.model_id === model_id
          ? {
              ...model,
              model_metadata: {
                ...model.model_metadata,
                upVote: model.model_metadata.upVote + upVote,
                downVote: model.model_metadata.downVote + downVote,
              },
            }
          : model,
      ),
    );
  };

  const modelsToDisplay = modelList.slice(
    (currentPage - 1) * modelsPerPage,
    currentPage * modelsPerPage,
  );

  const redirectToNewPage = useRedirectToNewPage();

  return (
    <Container>
      <FilterContainer>
        <span>筛选：</span>
        <StyledSelect
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="O">所有性别</option>
          <option value="M">男</option>
          <option value="W">女</option>
        </StyledSelect>
      </FilterContainer>
      <ModelList>
        {modelsToDisplay.map((model) => (
          <ModelItem
            key={model.model_id}
            onClick={() => {
              setIsModalVisible(true);
              setSelectedModel(model);
            }}
          >
            <ModelImageContainer>
              <ModelImage
                src={model.model_metadata.image_url}
                alt={model.model_name}
              />
            </ModelImageContainer>
            <ModelInfo>
              <h3>{model.model_name}</h3>
              <p>上传者：{model.model_metadata.user_id}</p>
              <p>{model.model_metadata.description}</p>
            </ModelInfo>
            <VoteSection>
              <VoteButton onClick={(e) => handleVote(model.model_id, true, e)}>
                <UpvoteIcon />
                <span>{model.model_metadata.upVote}</span>
              </VoteButton>
              <VoteButton onClick={(e) => handleVote(model.model_id, false, e)}>
                <DownvoteIcon />
                <span>{model.model_metadata.downVote}</span>
              </VoteButton>
            </VoteSection>
          </ModelItem>
        ))}
      </ModelList>
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton key={index} onClick={() => handleClick(index + 1)}>
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
      <Modal
        title="角色详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          setIsModalVisible(false);
          if (selectedModel)
            redirectToNewPage(`/chat/${selectedModel.model_id}`);
        }}
        cancelText={'取消'}
        okText={'开始聊天 >'}
      >
        {selectedModel && (
          <ModalContent>
            {Object.entries(selectedModel.model_metadata).map(
              ([key, value]) => {
                // 检查当前键是否在excludedKeys数组中，以及值是否为非空字符串
                if (
                  !excludedKeys.includes(key) &&
                  typeof value === 'string' &&
                  value !== ''
                ) {
                  // 使用映射表将英文键替换为中文键
                  const cnKey = enToCnMap[key] || key;
                  return (
                    <div key={key}>
                      <strong>{cnKey}:</strong> {value}
                    </div>
                  );
                }
                return null;
              },
            )}
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};
const UpvoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#ffffff"
  >
    <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path>
  </svg>
);

const DownvoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#ffffff"
  >
    <path d="M20 3H6.693A2.01 2.01 0 0 0 4.82 4.298l-2.757 7.351A1 1 0 0 0 2 12v2c0 1.103.897 2 2 2h5.612L8.49 19.367a2.004 2.004 0 0 0 .274 1.802c.376.52.982.831 1.624.831H12c.297 0 .578-.132.769-.36l4.7-5.64H20c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-8.469 17h-1.145l1.562-4.684A1 1 0 0 0 11 14H4v-1.819L6.693 5H16v9.638L11.531 20zM18 14V5h2l.001 9H18z"></path>
  </svg>
);

// 不想显示在Modal里的键的列表
const excludedKeys = [
  'image_url',
  'user_id',
  '头像地址src',
  'initial_prompt',
  'img_url',
  'other_patterns',
];

const enToCnMap: { [key: string]: string } = {
  name: '姓名',
  gender: '性别',
  age: '年龄',
  occupation: '职业',
  other_patterns: '其他特征',
  greetings: '口头禅',
  hometown: '家乡',
  relationship: '和我的关系',
  city: '所在城市',
  dislike: '讨厌的事物',
  goodwill: '好感度',
  moralSense: '道德感',
  humor: '幽默感',
};

const ModalContent = styled.div`
  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: #523dff;
  border: 1px solid #523dff;
  border-radius: 5px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
  padding: 6px 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #503dff73;
  }

  &.active {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
  }
`;
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  width: 100px;
  height: 40px;
  font-size: 16px;
  padding: 4px 12px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  appearance: none;
`;

const Container = styled.div`
  max-width: 1700px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: white;
`;

const ModelList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const ModelItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  height: 100%;

  &:hover {
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  }
`;

const ModelImageContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModelImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ModelInfo = styled.div`
  text-align: center;

  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    color: #d4d4d4;
    margin-bottom: 5px;
  }

  p:first-of-type {
    font-weight: bold;
  }
`;

const VoteSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;
const VoteButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  color: #dfdfdf;
  cursor: pointer;

  i {
    font-size: 18px;
  }

  span {
    font-size: 14px;
    margin-left: 5px;
  }

  &:hover {
    color: #a2a2a2d5;
  }
`;

export default MyForum;
