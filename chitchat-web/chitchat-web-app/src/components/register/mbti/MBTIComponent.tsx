import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title } = Typography;
const { Meta } = Card;

interface MBTIComponentProps {
  question: string;
  option1: string;
  option2: string;
  selectedOption: number;
  onOptionSelect: (option: number) => void;
}

const MBTIComponent: React.FC<MBTIComponentProps> = ({
  question,
  option1,
  option2,
  selectedOption,
  onOptionSelect,
}) => {
  const handleOptionClick = (option: number) => {
    onOptionSelect(option);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: 'white',
          fontFamily: '"微软雅黑", sans-serif',
        }}
      >
        {question}
      </Title>
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '12px' }}>
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: selectedOption === 0 ? '#c0c0c0' : '#e0e0e0',
            }}
            onClick={() => handleOptionClick(0)}
          >
            <Meta description={option1} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: selectedOption === 1 ? '#c0c0c0' : '#e0e0e0',
            }}
            onClick={() => handleOptionClick(1)}
          >
            <Meta description={option2} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MBTIComponent;
