import React from 'react';
import { DatePicker, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface GenericCollectionProps<T> {
  headline?: string;
  inputType: 'text' | 'date';
  onInputChange: (value: T) => void;
  value?: T;
}

const GenericCollection: React.FC<GenericCollectionProps<any>> = ({
  headline,
  inputType,
  onInputChange,
  value
}) => {
  const renderField = () => {
    if (inputType === 'date') {
      const dateValue = value ? dayjs(value) : undefined;

      return (
        <DatePicker
          value={dateValue}
          onChange={(date: Dayjs | null) =>
            onInputChange(date ? date.format('YYYY-MM-DD') : null)
          }
          format="YYYY-MM-DD"
        />
      );
    }

    return (
      <Input
        type={inputType}
        value={value || ''}
        onChange={(event) => onInputChange(event.target.value)}
      />
    );
  };

  return (
    <div>
      {headline && <h2>{headline}</h2>}
      {renderField()}
    </div>
  );
};

export default GenericCollection;
