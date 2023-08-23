import React from 'react';
import { Radio } from 'antd';
import styled from 'styled-components';
import GenderType from '../../../types/GenderType';

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-wrapper {
    color: white;
  }
`;

interface GenderCollectionProps {
  selectedOption?: GenderType | undefined;
  onSelectOption: (option: GenderType) => void;
}

const GenderCollection: React.FC<GenderCollectionProps> = ({
  selectedOption,
  onSelectOption,
}) => {
  return (
    <div>
      <StyledRadioGroup
        value={selectedOption}
        onChange={(e) => onSelectOption(e.target.value)}
      >
        <Radio value={GenderType.MALE}>男</Radio>
        <Radio value={GenderType.FEMALE}>女</Radio>
        <Radio value={GenderType.OTHER}>保密</Radio>
      </StyledRadioGroup>
    </div>
  );
};

export default GenderCollection;
