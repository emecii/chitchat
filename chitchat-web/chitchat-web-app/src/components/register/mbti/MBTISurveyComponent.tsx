import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface MBTISurveyComponentProps {
  onMBTITypeChange: (value: string) => void;
}

const MBTISurveyComponent: React.FC<MBTISurveyComponentProps> = ({
  onMBTITypeChange,
}) => {
  const handleMBTITypeChange = (value: string) => {
    onMBTITypeChange(value);
    setMBTIType(value);
  };
  const [mbtiType, setMBTIType] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <p>请选择你的MBTI人格:</p>
      <Select
        style={{ width: '100%', marginBottom: '20px' }}
        placeholder="请选择你的MBTI人格"
        onChange={handleMBTITypeChange}
        value={mbtiType}
      >
        <Option value="IDK">我不知道</Option>
        <Option value="ISTJ">ISTJ - 检查员人格</Option>
        <Option value="ISFJ">ISFJ - 提供者人格</Option>
        <Option value="INFJ">INFJ - 占卜师人格</Option>
        <Option value="INTJ">INTJ - 建筑师人格</Option>
        <Option value="ISTP">ISTP - 冒险家人格</Option>
        <Option value="ISFP">ISFP - 艺术家人格</Option>
        <Option value="INFP">INFP - 中介者人格</Option>
        <Option value="INTP">INTP - 逻辑学家人格</Option>
        <Option value="ESTP">ESTP - 实干家人格</Option>
        <Option value="ESFP">ESFP - 表演家人格</Option>
        <Option value="ENFP">ENFP - 公关人员人格</Option>
        <Option value="ENTP">ENTP - 发明家人格</Option>
        <Option value="ESTJ">ESTJ - 执行官人格</Option>
        <Option value="ESFJ">ESFJ - 主人人格</Option>
        <Option value="ENFJ">ENFJ - 教师人格</Option>
        <Option value="ENTJ">ENTJ - 统帅人格</Option>
      </Select>
    </div>
  );
};

export default MBTISurveyComponent;
