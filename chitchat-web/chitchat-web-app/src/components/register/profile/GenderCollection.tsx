import React from 'react';
import { Radio } from 'antd';

interface GenderCollectionProps {
  selectedOption?: string | undefined;
  onSelectOption: (option: string) => void;
}

const GenderCollection: React.FC<GenderCollectionProps> = ({
  selectedOption,
  onSelectOption
}) => {
  return (
    <div>
      <Radio.Group
        value={selectedOption}
        onChange={(e) => onSelectOption(e.target.value)}
      >
        <Radio value="Male">Male</Radio>
        <Radio value="Female">Female</Radio>
        <Radio value="Unknown">Unknown</Radio>
      </Radio.Group>
    </div>
  );
};

export default GenderCollection;
